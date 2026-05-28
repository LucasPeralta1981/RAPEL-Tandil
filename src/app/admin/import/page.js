// src/app/admin/import/page.js
'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ImportPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files;
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        setPreview(jsonData.slice(0, 5)); // Mostrar solo los primeros 5 para preview
        setError('');
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo Excel');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`¡Éxito! Se importaron ${data.count} productos correctamente.`);
        setFile(null);
        setPreview([]);
      } else {
        setError(data.error || 'Error al importar productos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📥 Carga Masiva de Productos</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">Instrucciones:</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>El archivo debe estar en formato <strong>.xlsx</strong> o <strong>.csv</strong></li>
            <li>Columnas requeridas: <code>name</code>, <code>price</code>, <code>sku</code>, <code>quantity</code></li>
            <li>Opcional: <code>description</code>, <code>category</code>, <code>image</code></li>
            <li>Descarga la <a href="/template-productos.xlsx" className="text-blue-600 hover:underline">plantilla aquí</a> (si la tienes)</li>
          </ul>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona tu archivo Excel:
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {preview.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Vista previa (primeros 5 registros):</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(preview).map((key) => (
                      <th key={key} className="px-4 py-2 text-left font-medium text-gray-500 uppercase">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-4 py-2 text-gray-700">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            ✅ {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            ❌ {error}
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || preview.length === 0}
          className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Procesando...' : 'Importar Productos'}
        </button>
      </div>
    </div>
  );
}