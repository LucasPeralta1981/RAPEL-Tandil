// src/components/ProductCard.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isB2B = session?.user?.role === 'wholesale' || session?.user?.role === 'admin';
  
  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Simular agregar al carrito (en producción, usarías un contexto de carrito)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === product._id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cart.reduce((sum, item) => sum + item.quantity, 0).toString());
    
    // Actualizar contador en el navbar
    window.dispatchEvent(new Event('storage'));
    
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
      alert('Producto agregado al carrito');
    }, 500);
  };

  const handleRequestQuote = () => {
    // Lógica para agregar a una lista de cotización B2B
    const quoteItems = JSON.parse(localStorage.getItem('quoteItems') || '[]');
    const existingItem = quoteItems.find(item => item.productId === product._id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      quoteItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }
    
    localStorage.setItem('quoteItems', JSON.stringify(quoteItems));
    alert('Producto agregado a la solicitud de presupuesto');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagen del producto */}
      <div className="relative">
        <img 
          src={product.image || 'https://via.placeholder.com/300x200'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.quantity === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            AGOTADO
          </div>
        )}
        {product.quantity < 10 && product.quantity > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
            POCAS UNIDADES
          </div>
        )}
      </div>
    </div>
  );
}
