import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
// src/app/api/orders/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(req) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { items, shippingAddress, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Validar y calcular total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({ 
          error: `Producto no encontrado: ${item.productId}` 
        }, { status: 404 });
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json({ 
          error: `Stock insuficiente para: ${product.name}` 
        }, { status: 400 });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      // Actualizar stock
      product.quantity -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemTotal
      });
    }

    // Crear pedido
    const order = new Order({
      user: session.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending', // pending, processing, shipped, delivered, cancelled
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    });

    await order.save();

    return NextResponse.json({
      message: 'Pedido creado exitosamente',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando pedido:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// GET: Obtener todos los pedidos (solo admin)
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await connectDB();
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}