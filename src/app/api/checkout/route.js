import { NextResponse } from 'next/server';
import { Preference } from 'mercadopago';
import client from '@/lib/mercadopago';
export async function POST(req) {
try {
const body = await req.json();
const preference = new Preference(client);
const response = await preference.create({
body: {
items: body.items,
},
});
return NextResponse.json({
id: response.id,
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