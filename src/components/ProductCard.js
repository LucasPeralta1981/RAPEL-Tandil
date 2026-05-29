'use client';
export default function ProductCard({ product }) {
const addToCart = () => {
const cart = JSON.parse(localStorage.getItem('cart')) || [];
cart.push(product);
localStorage.setItem('cart', JSON.stringify(cart));
alert('Producto agregado');
};
return (
<div className="border rounded-lg p-4 shadow">
<img
src={product.imageUrl}
alt={product.name}
className="w-full h-48 object-cover"
/>
<h2 className="text-lg font-bold mt-4">
{product.name}
</h2>
<p className="text-gray-600">
{product.description}
</p>
<p className="text-2xl font-bold mt-3 text-blue-700">
${product.price}
</p>
<button
onClick={addToCart}
className="bg-green-600 text-white w-full py-2 mt-4 rounded"
>
Agregar al carrito
</button>
</div>
);
}

