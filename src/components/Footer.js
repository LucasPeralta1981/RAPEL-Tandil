// src/components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">RepuestosYA</h3>
            <p className="text-gray-400 mb-4">
              Tu socio confiable en repuestos automotrices. Calidad garantizada, 
              envíos a todo el país y atención personalizada para mayoristas y minoristas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">📘</a>
              <a href="#" className="text-gray-400 hover:text-white">📷</a>
              <a href="#" className="text-gray-400 hover:text-white">🐦</a>
              <a href="#" className="text-gray-400 hover:text-white">💼</a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">Sobre Nosotros</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Categorías</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contacto</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Av. Siempre Viva 123, Buenos Aires</li>
              <li>📞 +54 11 1234-5678</li>
              <li>✉️ ventas@repuestosya.com</li>
              <li>🕒 Lun-Vie: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RepuestosYA. Todos los derechos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white">Política de Privacidad</Link>
            <Link href="/terms" className="hover:text-white">Términos y Condiciones</Link>
            <Link href="/shipping" className="hover:text-white">Envíos y Devoluciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}