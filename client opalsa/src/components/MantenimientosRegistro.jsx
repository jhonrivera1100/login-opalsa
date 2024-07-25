import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getMaquinasRequest } from '../api/maquinas'; // Asegúrate de tener esta función en tu archivo api/maquinas.js
import Select from 'react-select';

const MantenimientoRegistro = () => {
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

  const handleSerieChange = (selectedOption) => {
    if (selectedOption) {
      const selectedSerie = selectedOption.value;
      setNroSerieMaquina(selectedSerie);
      const selectedMaquina = maquinas.find(maquina => maquina.nroSerieMaquina === selectedSerie);
      if (selectedMaquina) {
        setNombreMaquina(selectedMaquina.marcaMaquina);
        setUbicacionMaquina(selectedMaquina.ubicacionMaquina);
      } else {
        setNombreMaquina('');
        setUbicacionMaquina('');
      }
    } else {
      setNroSerieMaquina('');
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
      setError('Error al crear mantenimiento. Inténtalo de nuevo.');
    }
  };

  const maquinaOptions = maquinas.map(maquina => ({
    value: maquina.nroSerieMaquina,
    label: maquina.nroSerieMaquina,
  }));

  return (
    <div className="container mx-auto my-4 px-4 lg:px-20">
      <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
        <div className="flex justify-center">
          <h1 className="font-bold uppercase text-3xl md:text-4xl text-center">Registrar Mantenimiento</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
            <Select
              value={maquinaOptions.find(option => option.value === nroSerieMaquina)}
              onChange={handleSerieChange}
              options={maquinaOptions}
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Número de Serie"
            />
            <input
              type="text"
              value={nombreMaquina}
              readOnly
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Marca de la Máquina"
            />
            <input
              type="text"
              value={ubicacionMaquina}
              readOnly
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Ubicación de la Máquina"
            />
            <input
              type="text"
              value={tipoMantenimiento}
              onChange={(e) => setTipoMantenimiento(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Tipo de Mantenimiento"
            />
            <input
              type="date"
              value={fechaMantenimiento}
              onChange={(e) => setFechaMantenimiento(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mt-4">
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Descripción"
            ></textarea>
          </div>                
          <div className="mt-4">
            <input
              type="file"         
              onChange={(e) => setArchivo(e.target.files[0])}
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <div className="mt-4">
            <button
              type="submit"
              className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-white p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
            >
            Enviar
            </button>
          </div>
        </form>
      </div>                  
    </div>
  );
};

export default MantenimientoRegistro;
