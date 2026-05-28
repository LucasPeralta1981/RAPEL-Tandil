// src/app/tracking/page.js
'use client';
import { useState } from 'react';

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTracking = async (e) => {
    e.preventDefault();
    if (!orderId) {
      setError('Por favor ingresa un número de pedido');
      return;
    }

    setLoading(true);
    setError('');
    setTrackingInfo(null);

    try {
      // Llamada a tu API de tracking (debes crearla en app/api/track/route.js)
      const res = await fetch(`/api/track?orderId=${orderId}`);
      
      if (!res.ok) {
        throw new Error('Pedido no encontrado');
      }

      const data = await res.json();
      setTrackingInfo(data);
    } catch (err) {
      setError(err.message || 'Error al obtener el estado del pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
          📦 Rastrea tu Pedido
        </h1>
        
        <form onSubmit={handleTracking} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Ingresa tu número de pedido (ej: ORD-12345)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Buscando...' : 'Rastrear'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </form>

        {/* Resultado del Rastreo */}
        {trackingInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-green-800">
              Estado del Pedido: <span className="text-green-600">{trackingInfo.orderId}</span>
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estado Actual:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold 
                  ${trackingInfo.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                    trackingInfo.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                    trackingInfo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {trackingInfo.status.toUpperCase()}
                </span>
              </div>
              
              <div>
                <p className="text-gray-600 mb-2">Detalles del envío:</p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  <li>Fecha de pedido: {new Date(trackingInfo.createdAt).toLocaleDateString()}</li>
                  <li>Cliente: {trackingInfo.customerName}</li>
                  <li>Total: ${trackingInfo.totalAmount}</li>
                  {trackingInfo.trackingNumber && (
                    <li>Número de guía: <strong>{trackingInfo.trackingNumber}</strong></li>
                  )}
                </ul>
              </div>

              {trackingInfo.status === 'shipped' || trackingInfo.status === 'delivered' ? (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    🚚 Tu pedido está en camino o ha sido entregado. 
                    {trackingInfo.trackingNumber && 
                      `Puedes seguirlo con el número de guía: ${trackingInfo.trackingNumber}`}
                  </p>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    ⏳ Tu pedido está siendo procesado. 
                    Recibirás una notificación cuando sea enviado.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instrucciones si no hay resultado */}
        {!trackingInfo && !error && !loading && (
          <div className="text-center text-gray-500 mt-8">
            <p>Ingresa tu número de pedido para ver el estado de tu envío.</p>
            <p className="text-sm mt-2">¿No encuentras tu número? Revisa tu correo de confirmación.</p>
          </div>
        )}
      </div>
    </div>
  );
}