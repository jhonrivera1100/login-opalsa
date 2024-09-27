import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getMaquinasRequest } from '../api/maquinas';
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
  const [successMessage, setSuccessMessage] = useState(null);
  const [maquinas, setMaquinas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const response = await getMaquinasRequest();
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
    setIsSubmitting(true);

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

      setSuccessMessage('Mantenimiento registrado exitosamente');
      setError(null);
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
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const maquinaOptions = maquinas.map(maquina => ({
    value: maquina.nroSerieMaquina,
    label: maquina.nroSerieMaquina,
  }));

  return (
    <div className="container mx-auto my-4 px-4 lg:px-20">
      {isSubmitting && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75 z-50">
          <div className="relative flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img
              src="https://res.cloudinary.com/dtqiwgbbp/image/upload/v1727359701/vjg0klgqxuqfiesshgdb.jpg"
              className="rounded-full h-28 w-28"
              alt="Loader"
            />
          </div>
        </div>
      )}
      <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
        <div className="flex justify-center">
          <h1 className="font-bold uppercase text-3xl md:text-4xl text-center">Registrar Mantenimiento</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
            <div>
              <label className="block font-bold mb-2">Número de Serie</label>
              <Select
                value={maquinaOptions.find(option => option.value === nroSerieMaquina)}
                onChange={handleSerieChange}
                options={maquinaOptions}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Seleccione Número de Serie"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Marca de la Máquina</label>
              <input
                type="text"
                value={nombreMaquina}
                readOnly
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Marca de la Máquina"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Ubicación de la Máquina</label>
              <input
                type="text"
                value={ubicacionMaquina}
                readOnly
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Ubicación de la Máquina"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Tipo de Mantenimiento</label>
              <input
                type="text"
                value={tipoMantenimiento}
                onChange={(e) => setTipoMantenimiento(e.target.value)}
                maxLength={50}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Tipo de Mantenimiento (máx. 50 caracteres)"
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Fecha de Mantenimiento</label>
              <input
                type="date"
                value={fechaMantenimiento}
                onChange={(e) => setFechaMantenimiento(e.target.value)}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-bold mb-2">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={1000}
              className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Descripción del Mantenimiento (máx. 1000 caracteres)"
            ></textarea>
          </div>
          <div className="mt-4">
            <label className="block font-bold mb-2">Archivo Adjunto</label>
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className='mt-5'>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                <p>{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-white p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
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
