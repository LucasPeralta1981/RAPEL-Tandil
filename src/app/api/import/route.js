import { NextResponse } from 'next/server';
import xlsx from 'xlsx';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
export async function POST(req) {
try {
await connectDB();
const formData = await req.formData();
const file = formData.get('file');
const bytes = await file.arrayBuffer();
const buffer = Buffer.from(bytes);
const workbook = xlsx.read(buffer, {
type: 'buffer',
});
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
for (const item of data) {
await Product.findOneAndUpdate(
{
sku: item.sku,
},
{
sku: item.sku,
name: item.nombre,
description: item.descripcion,
price: item.precio,
stock: item.stock,
category: item.categoria,
imageUrl: item.imagen_url,
},
{
upsert: true,
new: true,
}
);
}
return NextResponse.json({
success: true,
});
} catch (error) {
return NextResponse.json(
{
error: error.message,
},
{
status: 500,
}
);
}
}