'use client';
import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación: reemplazar con fetch real a /api/orders/admin
    const mockOrders = [
      { _id: 'ord1', userId: 'u1', total: 15000, status: 'pagado', createdAt: '2023-10-01', userRole: 'b2b' },
      { _id: 'ord2', userId: 'u2', total: 45000, status: 'pendiente', createdAt: '2023-10-02', userRole: 'b2c' },
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const updateStatus = async (id, newStatus) => {
    // Aquí iría la llamada API: fetch(`/api/orders/${id}`, { method: 'PATCH', body: ... })
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
  };

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userRole === 'b2b' ? 'Cliente B2B' : 'Cliente B2C'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">${order.total.toLocaleString('es-AR')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'pagado' ? 'bg-green-100 text-green-800' : 
                      order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="pagado">Pagado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
