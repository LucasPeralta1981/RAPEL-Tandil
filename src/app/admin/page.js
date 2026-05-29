'use client';
import { useState } from 'react';
export default function AdminPage() {
const [file, setFile] = useState(null);
const uploadExcel = async () => {
const formData = new FormData();
formData.append('file', file);
const res = await fetch('/api/import', {
method: 'POST',
body: formData,
});
const data = await res.json();
if (data.success) {
alert('Productos importados');
}
};
return (
<div className="p-8">
<h1 className="text-4xl font-bold mb-8">
Panel Admin
</h1>
<input
type="file"
onChange={(e) => setFile(e.target.files[0])}
/>
<button
onClick={uploadExcel}
className="bg-blue-700 text-white px-4 py-2 rounded mt-4"
>
Importar Excel
</button>
</div>
);
}


