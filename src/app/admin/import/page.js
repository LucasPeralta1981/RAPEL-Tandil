'use client';
import { useState } from 'react';

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.file.files;
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/products/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) setMessage(`✅ Éxito: ${data.count} productos importados.`);
      else setMessage(`❌ Error: ${data.error}`);
    } catch (err) {
      setMessage('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Importar Productos (Excel/CSV)</h1>
      <p className="text-gray-600 mb-4">Sube un archivo con columnas: SKU, Nombre, Precio Base, Categoría, Stock.</p>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" name="file" accept=".xlsx,.csv" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Procesando...' : '📤 Subir e Importar'}
        </button>
      </form>
      {message && <p className="mt-4 font-semibold">{message}</p>}
    </div>
  );
}
