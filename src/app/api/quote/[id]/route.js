// src/app/api/quotes/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import Quote from '@/models/Quote';
import Order from '@/models/Order';

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await connectDB();
    const { action, notes, discount = 0 } = await req.json();
    const quoteId = params.id;

    const quote = await Quote.findById(quoteId);
    
    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }

    if (quote.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Solo se pueden modificar cotizaciones pendientes' 
      }, { status: 400 });
    }

    let newStatus = quote.status;
    let finalAmount = quote.totalAmount;

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        if (discount > 0) {
          finalAmount = quote.totalAmount * (1 - discount / 100);
          quote.notes = `${quote.notes || ''}\nDescuento aplicado: ${discount}%`;
        }
        break;
      
      case 'reject':
        newStatus = 'rejected';
        if (notes) {
          quote.notes = `${quote.notes || ''}\nMotivo de rechazo: ${notes}`;
        }
        break;
      
      case 'convert':
        // Convertir a pedido
        const order = new Order({
          user: quote.customer,
          items: quote.items,
          totalAmount: finalAmount,
          status: 'pending',
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          quote: quote._id,
          shippingAddress: quote.shippingAddress || {},
          paymentMethod: 'invoice' // Factura para B2B
        });
        
        await order.save();
        newStatus = 'converted';
        quote.convertedOrderId = order._id;
        break;
      
      default:
        return NextResponse.json({ 
          error: 'Acción no válida. Use: approve, reject, o convert' 
        }, { status: 400 });
    }

    quote.status = newStatus;
    if (notes && action !== 'convert') {
      quote.notes = `${quote.notes || ''}\n${notes}`;
    }
    
    if (action === 'approve' && discount > 0) {
      quote.finalAmount = finalAmount;
    }

    await quote.save();

    return NextResponse.json({
      message: `Cotización ${action} exitosamente`,
      quote: {
        id: quote._id,
        quoteId: quote.quoteId,
        status: quote.status,
        finalAmount: quote.finalAmount || quote.totalAmount
      }
    });

  } catch (error) {
    console.error('Error actualizando cotización:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// GET: Obtener una cotización específica
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    const quoteId = params.id;

    const quote = await Quote.findById(quoteId)
      .populate('customer', 'name email')
      .populate('items.product', 'name sku');

    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
    }

    // Verificar permisos
    if (session.user.role !== 'admin' && quote.customer._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error obteniendo cotización:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}