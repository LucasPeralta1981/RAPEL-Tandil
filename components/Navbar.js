// src/components/Navbar.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // Simular carga del carrito (en producción, esto vendría de un contexto o localStorage)
  useEffect(() => {
    const count = localStorage.getItem('cartCount') 
      ? parseInt(localStorage.getItem('cartCount')) 
      : 0;
    setCartCount(count);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">RepuestosYA</span>
            </Link>
          </div>

          {/* Buscador */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar repuestos, neumaticos..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600"
              >
                🔍
              </button>
            </form>
          </div>

          {/* Menú de navegación */}
          <div className="flex items-center space-x-4">
            {/* Enlaces para invitados */}
            {!session && (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Registrarse
                </Link>
              </>
            )}

            {/* Enlaces para usuarios logueados */}
            {session && (
              <>
                <div className="relative">
                  <Link href="/cart" className="text-gray-700 hover:text-blue-600 relative">
                    🛒 Carrito
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                {session.user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="text-gray-700 hover:text-purple-600 font-medium">
                    Admin
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <img 
                      src={session.user.image || 'https://via.placeholder.com/30'} 
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden md:block">{session.user.name}</span>
                  </button>
                  
                  {/* Menú desplegable */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block border">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mi Perfil
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mis Pedidos
                    </Link>
                    <Link href="/quotes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mis Cotizaciones
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}