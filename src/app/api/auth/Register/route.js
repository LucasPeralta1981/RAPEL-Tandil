import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role, company, cuit } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: 'Email ya existe' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role, company, cuit });

    return NextResponse.json({ success: true, userId: user._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
