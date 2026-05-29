'use client';
import { useEffect, useState } from 'react';
import ProductCard from '../../Footer/components/ProductCard';
export default function ProductosPage() {
const [products, setProducts] = useState([]);
useEffect(() => {
fetch('/api/products')
.then((res) => res.json())
.then((data) => setProducts(data));
}, []);
return (
<div className="p-8">
<h1 className="text-4xl font-bold mb-8">
Productos
</h1>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{products.map((product) => (
<ProductCard
key={product._id}
product={product}
/>
))}
</div>
</div>
);
}
