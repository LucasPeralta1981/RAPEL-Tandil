import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === 'payment') {
      await connectDB();
      const preferenceId = data.id;

      // Buscar el pedido asociado
      const order = await Order.findOne({ mercadoPagoPreferenceId: preferenceId });
      if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });

      // Verificar estado del pago (necesitamos fetch al ID de pago de MP)
      const payment = await client.payments.get({ id: data.payment_id });
      
      if (payment.status === 'approved') {
        order.status = 'pagado';
        order.paymentMethod = payment.payment_type_id;
        await order.save();
        
        // Aquí podrías disparar el correo de "Pago Exitoso"
        console.log(`✅ Pago aprobado para pedido ${order._id}`);
      } else if (payment.status === 'pending') {
        order.status = 'pendiente'; // O 'esperando_pago'
        await order.save();
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error webhook:', error);
    return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
  }
}
