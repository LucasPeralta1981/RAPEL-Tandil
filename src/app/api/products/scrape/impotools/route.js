// src/app/api/products/scrape/impotools/route.js
import { NextResponse } from 'next/server';
import { scrapeImpoToolsProduct } from '@/lib/impotools-scraper';
import Product from '@/models/Product'; // Tu modelo existente

export async function POST(req) {
  try {
    const { url, sku } = await req.json();

    // 1. Scraping
    const result = await scrapeImpoToolsProduct(url);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const scrapedData = result.data;

    // 2. Actualizar o Crear en tu Base de Datos
    // Busca por SKU o por si ya existe un producto vinculado a esta URL
    let product = await Product.findOne({ 
      $or: [{ sku: sku }, { externalUrl: url }] 
    });

    if (product) {
      // Actualizado
      product.price = scrapedData.price;
      product.stock = scrapedData.stock ? 10 : 0; // Ajusta lógica de stock
      product.lastPriceUpdate = new Date();
      await product.save();
      return NextResponse.json({ message: 'Precio actualizado', product });
    } else {
      // Nuevo producto (opcional)
      const newProduct = await Product.create({
        name: scrapedData.title,
        sku: sku || 'IMP-' + Math.random().toString(36).substr(2, 9),
        price: scrapedData.price,
        stock: scrapedData.stock ? 10 : 0,
        externalUrl: url,
        supplier: 'ImpoTools'
      });
      return NextResponse.json({ message: 'Producto creado', product: newProduct });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Error interno', details: error.message }, { status: 500 });
  }
}