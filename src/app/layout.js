import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Proteger ruta: Solo admins
  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-blue-400">R.A.P.E.L Admin</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block p-3 hover:bg-gray-800 rounded">📊 Dashboard</Link>
          <Link href="/admin/import" className="block p-3 hover:bg-gray-800 rounded">📤 Importar Excel</Link>
          <Link href="/admin/quotes" className="block p-3 hover:bg-gray-800 rounded">📋 Cotizaciones B2B</Link>
          <Link href="/admin/orders" className="block p-3 hover:bg-gray-800 rounded">📦 Pedidos</Link>
          <Link href="/" className="block p-3 text-gray-400 mt-8">⬅️ Volver a la Tienda</Link>
        </nav>
      </aside>
      {/* Contenido Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}