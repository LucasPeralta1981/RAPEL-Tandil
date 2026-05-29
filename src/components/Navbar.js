import Link from 'next/link';
export default function Navbar() {
return (
<nav className="bg-black text-white p-4 flex justify-between">
<Link href="/">
R.A.P.E.L
</Link>
<div className="flex gap-4">
<Link href="/productos">
Productos
</Link>
<Link href="/carrito">
Carrito
</Link>
</div>
</nav>
);
}