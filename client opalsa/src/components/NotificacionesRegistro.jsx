import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const CrearMantenimiento = () => {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaMantenimiento, setFechaMantenimiento] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recordatorioData = {
      titulo,
      descripcion,
      fechaRecordatorio: fechaMantenimiento, // Cambio de fechaMantenimiento a fechaRecordatorio
      usuario: user.username, // Guarda el nombre del usuario en el recordatorio
    };

    try {
      const response = await axios.post("/recordatorios", recordatorioData); // Cambiar a la ruta correcta "/api/recordatorios"
      console.log("Recordatorio creado:", response.data);
      setError(null);
    } catch (error) {
      console.error("Error al crear recordatorio:", error);
      setError("Error al crear el recordatorio. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Crear Recordatorio</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Título</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32" required></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Recordatorio</label>
          <input type="date" value={fechaMantenimiento} onChange={(e) => setFechaMantenimiento(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Crear</button>
      </form>
    </div>
  );
};

export default CrearMantenimiento;
