'use client';
import { useEffect, useState } from 'react';
export default function CarritoPage() {
const [cart, setCart] = useState([]);
useEffect(() => {
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
setCart(savedCart);
}, []);
const total = cart.reduce(
(acc, item) => acc + item.price,
0
);
return (
<div className="p-8">
<h1 className="text-4xl font-bold mb-6">
Carrito
</h1>
{cart.map((item, index) => (
<div
key={index}
className="border-b py-4"
>
<h2>{item.name}</h2>
<p>${item.price}</p>
</div>
))}
<h2 className="text-2xl font-bold mt-8">
Total: ${total}
</h2>
</div>
);
}

