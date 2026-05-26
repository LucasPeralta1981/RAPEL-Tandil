'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { useSession } from 'next-auth/react';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  useEffect(() => {
    // Simulación de datos (reemplazar con fetch real a API)
    const mock = [
      { _id: '1', sku: 'SH-5W30', name: 'Aceite Shell 5W30', category: 'aceites', finalPrice: 15000, stock: 100, imageUrl: 'https://via.placeholder.com/300' },
      { _id: '2', sku: 'NEUM-195', name: 'Neumático Michelin', category: 'neumaticos', finalPrice: 45000, stock: 10, imageUrl: 'https://via.placeholder.com/300' },
      { _id: '3', sku: 'REP-FRE', name: 'Pastillas Freno', category: 'repuestos', finalPrice: 8500, stock: 50, imageUrl: 'https://via.placeholder.com/300' },
    ];
    setProducts(mock);
    setLoading(false);
  }, []);

  const filtered = products.filter(p => 
    (cat === 'all' || p.category === cat) && 
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catálogo</h1>
     