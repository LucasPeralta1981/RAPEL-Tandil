// src/app/api/products/scrape/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const { url, sku } = await req.json();

    // 1. Descargar el HTML de la página del proveedor
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0...' } // Simular navegador real
    });

    // 2. Cargar el HTML en Cheerio
    const $ = cheerio.load(data);

    // 3. Extraer datos (Los selectores dependen de la web del proveedor)
    // Ejemplo genérico: debes inspeccionar la web específica para encontrar los IDs correctos
    const priceText = $('.price-current').text().trim(); 
    const productTitle = $('#product-title').text().trim();
    const inStock = $('.stock-status').text().includes('Disponible');

    // Limpiar el precio (quitar símbolos, convertir a número)
    const cleanPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    return NextResponse.json({
      success: true,
      data: {
        title: productTitle,
        price: cleanPrice,
        stock: inStock,
        url: url,
        lastUpdated: new Date(),
      }
    });
  } catch (error) {
    console.error('Error scraping:', error);
    return NextResponse.json({ success: false, error: 'No se pudo extraer el precio' }, { status: 500 });
  }
}
