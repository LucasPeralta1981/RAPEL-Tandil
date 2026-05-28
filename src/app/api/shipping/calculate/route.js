// src/app/api/shipping/calculate/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ShippingZone from '@/models/ShippingZone';
import Product from '@/models/Product';

export async function POST(req) {
  try {
    await connectDB();
    const { zipCode, province, items } = await req.json();

    if (!zipCode || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Datos incompletos' }, 
        { status: 400 }
      );
    }

    // Calcular peso total del pedido
    let totalWeight = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${item.productId}` }, 
          { status: 404 }
        );
      }
      totalWeight += product.weight * item.quantity;
    }

    // Buscar zona de envío correspondiente
    const zone = await ShippingZone.findMatchingZone(zipCode, province);
    
    if (!zone) {
      return NextResponse.json(
        { error: 'No hay opciones de envío disponibles para esta zona' }, 
        { status: 404 }
      );
    }

    // Verificar pedido mínimo
    if (zone.minOrderAmount > 0) {
      const orderTotal = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      if (orderTotal < zone.minOrderAmount) {
        return NextResponse.json(
          { 
            error: `El pedido mínimo para esta zona es $${zone.minOrderAmount.toLocaleString('es-AR')}`,
            minOrderAmount: zone.minOrderAmount
          }, 
          { status: 400 }
        );
      }
    }

    // Calcular costos para diferentes servicios
    const shippingOptions = [
      {
        service: 'standard',
        name: 'Envío Estándar',
        cost: zone.calculateCost(totalWeight, 'standard'),
        estimatedDays: zone.type === 'province' ? '3-5 días' : 
                      zone.type === 'region' ? '5-7 días' : '7-10 días'
      },
      {
        service: 'express',
        name: 'Envío Express',
        cost: zone.calculateCost(totalWeight, 'express'),
        estimatedDays: zone.type === 'province' ? '1-2 días' : 
                      zone.type === 'region' ? '3-4 días' : '5-7 días'
      }
    ];

    return NextResponse.json({
      success: true,
      zone: {
        name: zone.name,
        description: zone.description
      },
      weight: totalWeight,
      options: shippingOptions,
      notes: zone.notes
    });

  } catch (error) {
    console.error('Error calculando envío:', error);
    return NextResponse.json(
      { error: 'Error al calcular el envío' }, 
      { status: 500 }
    );
  }
}