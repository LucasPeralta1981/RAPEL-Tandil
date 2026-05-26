import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className="relative h-[600px] flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Taller" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">R.A.P.E.L <span className="text-blue-500">Distribuidora</span></h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">Repuestos, Aceites Shell, Neumáticos y Herramientas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition">🛒 Ver Catálogo</Link>
            <Link href="/about" className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition">ℹ️ Quiénes Somos</Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Categorías</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['aceites', 'neumaticos', 'repuestos', 'herramientas'].map((cat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center border-t-4 border-blue-600">
                <h3 className="text-xl font-bold mb-2 capitalize">{cat}</h3>
                <Link href={`/catalog?cat=${cat}`} className="text-blue-600 font-semibold hover:underline">Ver productos →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}