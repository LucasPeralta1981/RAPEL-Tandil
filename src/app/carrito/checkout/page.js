'use client';
import { useCart, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!session) { alert("Debes iniciar sesión"); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart, 
          total, 
          userId: session.user.id,
          userRole: session.user.role
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirigir a MercadoPago
      window.location.href = data.url; 
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Resumen</h2>
        <p>Total a pagar: <span className="text-green-600 font-bold text-2xl">${total.toLocaleString('es-AR')}</span></p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button 
          onClick={handlePayment} 
          disabled={loading}
          className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg text-lg transition flex items-center justify-center gap-2"
        >
          {loading ? 'Procesando...' : '💳 Pagar con MercadoPago'}
        </button>
      </div>
    </div>
  );
}
