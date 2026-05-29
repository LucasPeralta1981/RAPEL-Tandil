import { NextResponse } from 'next/server';

import connectDB from '../../../lib/db';

import Product from '../../../models/Product';

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}