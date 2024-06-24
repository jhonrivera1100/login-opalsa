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
      // Limpiar campos del formulario después del envío exitoso
      setTitulo("");
      setDescripcion("");
      setFechaMantenimiento("");
    } catch (error) {
      console.error("Error al crear recordatorio:", error);
      setError("Error al crear el recordatorio. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="container mx-auto my-4 px-4 lg:px-20">
      <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
        <div className="flex justify-center">
          <h2 className="font-bold uppercase text-3xl md:text-4xl text-center">Notificar Al Administrador</h2>
        </div>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 mt-5">
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline h-32"
                required
              ></textarea>
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Recordatorio</label>
              <input
                type="date"
                value={fechaMantenimiento}
                onChange={(e) => setFechaMantenimiento(e.target.value)}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearMantenimiento;
