import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import UserHeader from '../components/UserHeader';
import MantenimientosList from '../components/mantenimientoLista';
import { getMaquinasRequest } from '../api/maquinas';

const RegistroMantenimiento = () => {
  const [nroSerieMaquina, setNroSerieMaquina] = useState('');
  const [nombreMaquina, setNombreMaquina] = useState('');
  const [ubicacionMaquina, setUbicacionMaquina] = useState('');
  const [tipoMantenimiento, setTipoMantenimiento] = useState('');
  const [fechaMantenimiento, setFechaMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);
  const [maquinas, setMaquinas] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const response = await getMaquinasRequest();
        console.log('Maquinas recibidas:', response.data);
        setMaquinas(response.data);
      } catch (err) {
        console.error('Error al obtener las máquinas:', err);
      }
    };

    fetchMaquinas();
  }, []);

  const handleSerieChange = (e) => {
    const selectedSerie = e.target.value;
    setNroSerieMaquina(selectedSerie);
    const selectedMaquina = maquinas.find(maquina => maquina.nroSerieMaquina === selectedSerie);
    if (selectedMaquina) {
      setNombreMaquina(selectedMaquina.nombreMaquina);
      setUbicacionMaquina(selectedMaquina.ubicacionMaquina);
    } else {
      setNombreMaquina('');
      setUbicacionMaquina('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('tipoMantenimiento', tipoMantenimiento);
    formData.append('fechaMantenimiento', fechaMantenimiento);
    formData.append('descripcion', descripcion);
    formData.append('nroSerieMaquina', nroSerieMaquina);
    formData.append('nombreMaquina', nombreMaquina);
    formData.append('ubicacionMaquina', ubicacionMaquina);
    if (archivo) {
      formData.append('archivo', archivo);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/mantenimientos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMantenimientos([...mantenimientos, response.data]);
      setTipoMantenimiento('');
      setFechaMantenimiento('');
      setDescripcion('');
      setNroSerieMaquina('');
      setNombreMaquina('');
      setUbicacionMaquina('');
      setArchivo(null);
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Navbar />
      <UserHeader />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Registrar Mantenimiento</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Número de Serie de la Máquina</label>
            <select
              value={nroSerieMaquina}
              onChange={handleSerieChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Seleccione un número de serie</option>
              {maquinas.map((maquina) => (
                <option key={maquina._id} value={maquina.nroSerieMaquina}>{maquina.nroSerieMaquina}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de la Máquina</label>
            <input
              type="text"
              value={nombreMaquina}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Ubicación de la Máquina</label>
            <input
              type="text"
              value={ubicacionMaquina}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
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
    </div>
  );
};

export default RegistroMantenimiento;