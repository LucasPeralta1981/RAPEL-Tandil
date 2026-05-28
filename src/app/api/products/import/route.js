// ✅ CORRECTO (Usa el alias @)
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';

// ... resto de tu código ...

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import XLSX from 'xlsx';

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get('file');
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames;
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let count = 0;
    for (const row of sheetData) {
      await Product.findOneAndUpdate(
        { sku: row.SKU },
        {
          $set: {
            name: row.Nombre,
            basePrice: row['Precio Base'],
            category: row.Categoria,
            stock: row.Stock || 0,
            imageUrl: row['Imagen URL'] || ''
          }
        },
        { upsert: true, new: true }
      );
      count++;
    }

    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
