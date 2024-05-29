import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import UserHeader from '../components/UserHeader';

function RegistroMantenimiento() {
  const [numeroSerie, setNumeroSerie] = useState('');
  const [tipoMantenimiento, setTipoMantenimiento] = useState('');
  const [fechaMantenimiento, setFechaMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('numeroSerie', numeroSerie);
    formData.append('tipoMantenimiento', tipoMantenimiento);
    formData.append('fechaMantenimiento', fechaMantenimiento);
    formData.append('descripcion', descripcion);
    formData.append('archivo', archivo);

    try {
      // Enviar los datos a tu servidor (aquí solo se imprime en la consola)
      console.log({
        numeroSerie,
        tipoMantenimiento,
        fechaMantenimiento,
        descripcion,
        archivo,
      });

      // Limpiar el formulario después de enviarlo
      setNumeroSerie('');
      setTipoMantenimiento('');
      setFechaMantenimiento('');
      setDescripcion('');
      setArchivo(null);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar /> {/* Componente Navbar */}
      <UserHeader /> {/* Componente UserHeader */}
      <div className="container mx-auto px-4 py-8 w-[800px]">
        <div className='flex  justify-center'>
        <h2 className="text-2xl font-bold mb-4">Registro de Mantenimiento</h2>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numeroSerie">
              Número de Serie de la Máquina
            </label>
            <input
              type="text"
              id="numeroSerie"
              value={numeroSerie}
              onChange={(e) => setNumeroSerie(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoMantenimiento">
              Tipo de Mantenimiento
            </label>
            <input
              type="text"
              id="tipoMantenimiento"
              value={tipoMantenimiento}
              onChange={(e) => setTipoMantenimiento(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fechaMantenimiento">
              Fecha del Mantenimiento
            </label>
            <input
              type="date"
              id="fechaMantenimiento"
              value={fechaMantenimiento}
              onChange={(e) => setFechaMantenimiento(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="archivo">
              Adjuntar Archivo
            </label>
            <input
              type="file"
              id="archivo"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistroMantenimiento;