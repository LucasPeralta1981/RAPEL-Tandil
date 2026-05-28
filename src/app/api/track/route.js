// src/app/api/track/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'ID de pedido requerido' }, { status: 400 });
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 });
    }

    // Retornamos solo la información necesaria para el cliente (sin datos sensibles)
    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      createdAt: order.createdAt,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      // Aquí podrías agregar trackingNumber si tu proveedor de envíos lo da
      // trackingNumber: order.trackingNumber 
    });

  } catch (error) {
    console.error('Error en tracking:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}