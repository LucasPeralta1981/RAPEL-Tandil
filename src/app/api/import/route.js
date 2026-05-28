// src/app/api/import/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product'; // Debes crear este modelo
import XLSX from 'xlsx';
import multer from 'multer'; // Necesitarás instalarlo: npm install multer

// Configuración simple de multer para Next.js (puede requerir adaptación)
const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req) {
  try {
    await connectDB();
    
    // En Next.js App Router, necesitas manejar el formData manualmente
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Convertir el archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Leer el Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheet = workbook.Sheets[workbook.SheetNames];
    const products = XLSX.utils.sheet_to_json(firstSheet);

    // Validar y crear productos
    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      
      // Validación básica
      if (!productData.name || !productData.price || !productData.sku) {
        errors.push(`Fila ${i + 2}: Datos incompletos (name, price, sku requeridos)`);
        continue;
      }

      try {
        const product = await Product.create({
          name: productData.name,
          price: parseFloat(productData.price),
          sku: productData.sku,
          quantity: productData.quantity || 0,
          description: productData.description || '',
          category: productData.category || 'General',
          image: productData.image || '/default-product.jpg'
        });
        createdProducts.push(product);
      } catch (err) {
        errors.push(`Fila ${i + 2}: ${err.message}`);
      }
    }

    if (errors.length > 0 && createdProducts.length === 0) {
      return NextResponse.json({ 
        error: 'No se pudo importar ningún producto',
        details: errors 
      }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Importación completada',
      count: createdProducts.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error importando productos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}