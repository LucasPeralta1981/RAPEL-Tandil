import Link from 'next/link';
export default function HomePage() {
return (
<div className="min-h-screen flex flex-col justify-center items-center">
<h1 className="text-5xl font-bold mb-6">
R.A.P.E.L
</h1>
<p className="text-xl mb-8">
Repuestos, Aceites, Productos y Equipamiento Logístico
</p>
<Link
href="/productos"
className="bg-blue-700 text-white px-6 py-3 rounded"
>
Ver Productos
</Link>
</div>
);
}