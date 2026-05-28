// src/app/api/tracking/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');

    if (!orderNumber) {
      return NextResponse.json({ 
        error: 'Debe proporcionar un número de pedido' 
      }, { status: 400 });
    }

    await connectDB();
    
    const order = await Order.findOne({ orderNumber })
      .select('orderNumber status items totalAmount shippingAddress createdAt updatedAt trackingHistory')
      .lean();

    if (!order) {
      return NextResponse.json({ 
        error: 'Pedido no encontrado' 
      }, { status: 404 });
    }

    // Formatear respuesta para el cliente
    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: getStatusLabel(order.status),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      shippingAddress: order.shippingAddress,
      trackingHistory: order.trackingHistory || [],
      items: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    };

    return NextResponse.json(trackingInfo);
  } catch (error) {
    console.error('Error rastreando pedido:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 });
  }
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendiente de pago',
    processing: 'En preparación',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
}