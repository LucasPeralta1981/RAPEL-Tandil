// src/components/ProductCard.js
'use client';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        {/* Imagen del producto */}
        <img
          src={product.image || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Indicador de AGOTADO */}
        {product.quantity === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            AGOTADO
          </div>
        )}
        
        {/* Indicador de POCAS UNIDADES */}
        {product.quantity < 10 && product.quantity > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
            POCAS UNIDADES
          </div>
        )}
      </div> {/* ✅ CIERRE CORRECTO del div "relative" */}
      
      {/* Contenido del producto */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <StatusBadge 
            status={product.quantity} 
            type="product" 
          />
          
          <p className="text-xl font-bold text-blue-600">
            ${product.price.toLocaleString('es-AR')}
          </p>
        </div>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
          >
            Ver detalles
          </Link>
          
          {product.quantity > 0 && (
            <button
              onClick={() => {
                // Aquí iría la lógica para agregar al carrito
                console.log('Agregar al carrito:', product.name);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}