'use client';
import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, total } = useCart();
  const router = useRouter();

  if (cart.length === 0) return <div className="text-center py-20">Tu carrito está vacío. <Link href="/catalog" className="text-blue-600">Ir al catálogo</Link></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cart.map(item => (
          <div key={item._id} className="flex justify-between items-center p-4 border-b last:border-0">
            <div>
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              <p className="text-blue-600 font-bold">${item.finalPrice.toLocaleString('es-AR')} x {item.qty}</p>
            </div>
            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">🗑️</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <span className="text-xl font-bold">Total: ${total.toLocaleString('es-AR')}</span>
        <Link href="/cart/checkout" className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700">
          Proceder al Pago
        </Link>
      </div>
    </div>
  );
}
