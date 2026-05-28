// src/components/ShippingMethods.js
'use client';
import { useState, useEffect } from 'react';

export default function ShippingMethods({ destination, items = [] }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destination) return;

    setLoading(true);

    // Simular llamada a API de envíos (en producción, conectarías con una API real)
    const fetchShippingMethods = async () => {
      // Simulación de respuesta de API
      const mockMethods = [
        {
          id: 'correos-argentinos-standard',
          carrier: 'Correo Argentino',
          service: 'Encomienda Clásica',
          cost: 2500,
          estimatedDays: '5-7 días hábiles',
          tracking: true
        },
        {
          id: 'andreani-express',
          carrier: 'Andreani',
          service: 'Sucursal a Sucursal',
          cost: 3200,
          estimatedDays: '3-4 días hábiles',
          tracking: true
        },
        {
          id: 'oca-pago-facil',
          carrier: 'OCA',
          service: 'Pago Fácil',
          cost: 2800,
          estimatedDays: '4-6 días hábiles',
          tracking: true
        }
      ];

      // Simular filtro por zona (en producción, esto lo haría el backend)
      if (destination.zipCode.startsWith('9')) {
        // Zona Patagonia (más cara)
        mockMethods.forEach(method => {
          method.cost = Math.round(method.cost * 1.3);
          method.estimatedDays = method.estimatedDays.replace(/\d+-\d+/, days => {
            const [min, max] = days.split('-').map(Number);
            return `${min+2}-${max+3} días hábiles`;
          });
        });
      }

      setMethods(mockMethods);
      setLoading(false);
    };

    fetchShippingMethods();
  }, [destination]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Calculando opciones de envío...</span>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          ⚠️ Por favor, ingresa tu código postal para ver las opciones de envío disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">📦 Opciones de Envío</h3>
      
      {methods.map((method) => (
        <label 
          key={method.id}
          className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition"
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <p className="font-medium text-gray-900">{method.carrier} - {method.service}</p>
              <p className="text-sm text-gray-600">
                ⏱️ {method.estimatedDays} {method.tracking && '🔍 Con seguimiento'}
              </p>
            </div>
          </div>
          <p className="text-lg font-bold text-blue-600">${method.cost.toLocaleString('es-AR')}</p>
        </label>
      ))}
    </div>
  );
}