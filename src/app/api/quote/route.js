// src/app/api/quotes/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { connectDB } from '@/lib/db';
import Quote from '@/models/Quote';
import Product from '@/models/Product';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Permitir a usuarios autenticados o invitados (con datos completos)
    if (!session && !req.headers.get('x-quote-guest')) {
      return NextResponse.json({ error: 'Debe iniciar sesión o proporcionar datos completos' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { items, companyName, taxId, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Debe seleccionar productos para cotizar' }, { status: 400 });
    }

    // Validar productos y calcular total
    let totalAmount = 0;
    const quoteItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json({ 
          error: `Producto no encontrado: ${item.productId}` 
        }, { status: 404 });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      quoteItems.push({
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemTotal
      });
    }

    // Crear cotización
    const quoteData = {
      items: quoteItems,
      totalAmount,
      status: 'pending', // pending, approved, rejected, converted
      quoteId: `QT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    };

    // Si hay sesión, asociar al usuario
    if (session) {
      quoteData.customer = session.user.id;
      quoteData.customerName = session.user.name;
      quoteData.email = session.user.email;
    } else {
      // Datos de invitado
      if (!companyName || !taxId) {
        return NextResponse.json({ 
          error: 'Para cotizaciones B2B se requiere empresa y RUT/CUIT' 
        }, { status: 400 });
      }
      quoteData.companyName = companyName;
      quoteData.taxId = taxId;
      quoteData.email = body.email;
      quoteData.customerName = body.contactName;
    }

    if (notes) quoteData.notes = notes;

    const quote = new Quote(quoteData);
    await quote.save();

    return NextResponse.json({
      message: 'Presupuesto solicitado exitosamente',
      quote: {
        id: quote._id,
        quoteId: quote.quoteId,
        totalAmount: quote.totalAmount,
        status: quote.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando cotización:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// GET: Obtener cotizaciones (admin o del usuario)
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await connectDB();
    
    // Admin ve todas, usuarios ven solo las suyas
    const query = session.user.role === 'admin' 
      ? {} 
      : { customer: session.user.id };

    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .populate('customer', 'name email')
      .populate('items.product', 'name');

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error obteniendo cotizaciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}