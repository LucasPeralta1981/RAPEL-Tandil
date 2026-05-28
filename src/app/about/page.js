// src/app/about/page.js
import Link from 'next/link';

export const metadata = {
  title: 'Quiénes Somos | R.A.P.E.L',
  description: 'Conoce la historia y los valores de R.A.P.E.L, tu partner en logística y ventas.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestra Historia</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          En R.A.P.E.L, no solo vendemos productos; construimos relaciones. 
          Nacimos con la misión de facilitar el acceso a productos de calidad 
          con un servicio logístico impecable.
        </p>
      </div>

      {/* Valores y Misión */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Confianza</h3>
            <p>
              Tu seguridad es nuestra prioridad. Transparencia en cada transacción y 
              seguimiento en tiempo real de tu pedido.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Agilidad</h3>
            <p>
              Procesos optimizados para que recibas tus productos en el menor tiempo posible, 
              sin complicaciones.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Calidad</h3>
            <p>
              Seleccionamos cuidadosamente nuestros productos y partners logísticos 
              para garantizar la máxima calidad en cada entrega.
            </p>
          </div>
        </div>

        {/* Equipo / Contacto */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">¿Tienes dudas? Estamos aquí</h2>
          <p className="text-lg mb-8">
            Somos más que una tienda online. Somos tu equipo de ventas y logística. 
            Si necesitas asesoría personalizada, nuestro equipo está listo para ayudarte.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              Contáctanos
            </Link>
            <Link href="/tracking" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
              Rastrear Pedido
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}