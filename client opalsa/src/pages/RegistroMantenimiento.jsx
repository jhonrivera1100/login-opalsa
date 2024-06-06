import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistroMantenimiento = () => {
  const [nroSerieMaquina, setNroSerieMaquina] = useState('');
  const [nombreMaquina, setNombreMaquina] = useState('');
  const [ubicacionMaquina, setUbicacionMaquina] = useState('');
  const [tipoMantenimiento, setTipoMantenimiento] = useState('');
  const [fechaMantenimiento, setFechaMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaquina = async () => {
      if (nroSerieMaquina) {
        try {
          console.log('Número de Serie enviado:', nroSerieMaquina); // Debugging
          const response = await axios.get(`http://localhost:4000/api/nroSerie/${nroSerieMaquina}`);
          setNombreMaquina(response.data.nombreMaquina);
          setUbicacionMaquina(response.data.ubicacionMaquina);
        } catch (err) {
          setNombreMaquina('');
          setUbicacionMaquina('');
          console.error('Error al obtener información de la máquina:', err);
        }
      }
    };
  
    fetchMaquina();
  }, [nroSerieMaquina]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('tipoMantenimiento', tipoMantenimiento);
    formData.append('fechaMantenimiento', fechaMantenimiento);
    formData.append('descripcion', descripcion);
    formData.append('nroSerieMaquina', nroSerieMaquina);
    if (archivo) {
      formData.append('archivo', archivo);
    }

    try {
      await axios.post('http://localhost:4000/api/mantenimientos', formData);
      // Resetear el formulario después de enviar
      setTipoMantenimiento('');
      setFechaMantenimiento('');
      setDescripcion('');
      setNroSerieMaquina('');
      setArchivo(null);
    } catch (error) {
      setError(error.response.data.message);
      console.error('Error al crear mantenimiento:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Registrar Mantenimiento</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Número de Serie de la Máquina</label>
          <input
            type="text"
            value={nroSerieMaquina}
            onChange={(e) => setNroSerieMaquina(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {nombreMaquina && (
          <div className="mb-4">
            <p className="text-gray-700"><strong>Nombre de la Máquina:</strong> {nombreMaquina}</p>
            <p className="text-gray-700"><strong>Ubicación:</strong> {ubicacionMaquina}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Mantenimiento</label>
          <input
            type="text"
            value={tipoMantenimiento}
            onChange={(e) => setTipoMantenimiento(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Mantenimiento</label>
          <input
            type="date"
            value={fechaMantenimiento}
            onChange={(e) => setFechaMantenimiento(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Archivo</label>
          <input
            type="file"
            onChange={(e) => setArchivo(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
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
  );
};

export default RegistroMantenimiento;