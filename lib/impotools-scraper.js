// src/lib/impotools-scraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeImpoToolsProduct(url) {
  try {
    // 1. Hacemos la petición simulando ser un navegador real
    // Nota: Si ImpoTools tiene CAPTCHA, esto fallará y necesitarás un proxy (Bright Data)
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);

    // 2. EXTRACTORES (¡Aquí debes ajustar los selectores!)
    // Debes inspeccionar el elemento en la web de ImpoTools y copiar la clase o ID
    // Ejemplos comunes en WooCommerce (que usa ImpoTools probablemente):
    
    // TITULO
    const title = $('h1.product_title').text().trim();
    
    // PRECIO (Puede ser .price, .amount, o un span con clase específica)
    // Intenta buscar en el HTML: <span class="woocommerce-Price-amount amount">
    const priceText = $('span.woocommerce-Price-amount.amount').text().trim();
    
    // STOCK
    const inStock = $('.stock.in-stock').length > 0 || !$('.out-of-stock').length;

    // 3. Limpieza de datos (Quitar $, puntos, convertir a número)
    let cleanPrice = 0;
    if (priceText) {
      // Elimina todo lo que no sea número o punto
      const numericStr = priceText.replace(/[^0-9.,]/g, '');
      // Reemplaza coma por punto si es formato argentino (1.200,50 -> 1200.50)
      const formatted = numericStr.replace(/\./g, '').replace(',', '.');
      cleanPrice = parseFloat(formatted);
    }

    if (!title || cleanPrice <= 0) {
      throw new Error('No se pudo extraer precio o título. Revisa los selectores.');
    }

    return {
      success: true,
      data: {
        title: title,
        price: cleanPrice,
        currency: 'ARS',
        stock: inStock,
        source: 'ImpoTools',
        url: url,
        scrapedAt: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error scraping ImpoTools:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}