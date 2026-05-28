'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Fallido!</h1>
        <p className="text-gray-600 mb-6">Lamentamos informarte que tu pago no se ha podido completar. Por favor, intenta nuevamente.</p>
        <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Volver al Inicio</button>
      </div>
    </div>
  );
}