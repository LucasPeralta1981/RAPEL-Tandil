'use client';
import { useSession } from 'next-auth/react';

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const isB2B = session?.user?.role === 'b2b';

  const handleAction = () => {
    if (!session) { alert("Inicia sesión para comprar"); return; }
    alert(isB2B ? `Solicitar presupuesto: ${product.name}` : `Agregar al carrito: ${product.name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-48 bg-gray-100">
        <img src={product.imageUrl || 'https://via.placeholder.com/300?text=R.A.P.E.L'} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-xs text-gray-500 uppercase mb-1">{product.category}</p>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-3">SKU: {product.sku}</p>
        <div className="mt-auto">
          <span className="text-2xl font-extrabold text-blue-700">${product.finalPrice.toLocaleString('es-AR')}</span>
          {product.stock > 0 ? (
            <button onClick={handleAction} className={`w-full mt-4 py-2 rounded font-bold text-white ${isB2B ? 'bg-purple-600' : 'bg-green-600'}`}>
              {isB2B ? '📋 Cotizar' : '🛒 Comprar'}
            </button>
          ) : <button disabled className="w-full mt-4 py-2 bg-gray-300 text-gray-500 rounded">Agotado</button>}
        </div>
      </div>
    </div>
  );
}
