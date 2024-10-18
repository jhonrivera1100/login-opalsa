import React, { useState } from 'react';
import axios from 'axios';
import { useMaquinas } from '../context/MaquinasContext'; // Importamos el contexto

const MantenimientoRegistro = () => {
  const { buscarMaquinaPorSerie } = useMaquinas(); // Usamos la búsqueda de máquina por número de serie
  const [nroSerieMaquina, setNroSerieMaquina] = useState('');
  const [nombreMaquina, setNombreMaquina] = useState('');
  const [ubicacionMaquina, setUbicacionMaquina] = useState('');
  const [tipoMantenimiento, setTipoMantenimiento] = useState('');
  const [fechaMantenimiento, setFechaMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Manejar la búsqueda de la máquina por número de serie
  const handleSerieChange = async (e) => {
    const selectedSerie = e.target.value.trim(); // Obtenemos el número de serie del input
    if (selectedSerie) {
      setNroSerieMaquina(selectedSerie);
      setIsSearching(true);

      try {
        const selectedMaquina = await buscarMaquinaPorSerie(selectedSerie); // Realiza la búsqueda en el backend

        if (selectedMaquina) {
          setNombreMaquina(selectedMaquina.marcaMaquina);
          setUbicacionMaquina(selectedMaquina.ubicacionMaquina);
          setError(null); // Limpia los errores si todo va bien
        } else {
          setError(`No se encontró la máquina con número de serie: ${selectedSerie}`);
          setNombreMaquina('');
          setUbicacionMaquina('');
        }
      } catch (err) {
        console.error('Error al buscar la máquina:', err);
        setError('Error al buscar la máquina. Inténtalo de nuevo.');
      } finally {
        setIsSearching(false);
      }
    } else {
      setNroSerieMaquina('');
      setNombreMaquina('');
      setUbicacionMaquina('');
      setError(null);
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append('tipoMantenimiento', tipoMantenimiento);
  
    // Guardar la fecha como cadena de texto "YYYY-MM-DD" para evitar la conversión automática a UTC
    if (fechaMantenimiento) {
      formData.append('fechaMantenimiento', fechaMantenimiento); // La dejamos como string sin convertirla a objeto Date
    }
  
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
      // Limpiar el formulario
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
  
  

  const isMaquinaValida = ubicacionMaquina !== ""; // Verificar si la ubicación está llena

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
      {isSearching && <p></p>}
      <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
        <div className="flex justify-center">
          <h1 className="font-bold uppercase text-3xl md:text-4xl text-center">Registrar Mantenimiento</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
            <div className="relative">
              <label className="block font-bold mb-2">Número de Serie</label>
              <input
                type="text"
                value={nroSerieMaquina}
                onChange={handleSerieChange}
                className={`w-full mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                  isMaquinaValida ? "bg-green-200" : "bg-gray-100"
                } text-gray-900`}
                placeholder="Ingrese Número de Serie de la maquina"
              />
              {isMaquinaValida && (
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600 font-bold text-xl">
                  ✔
                </span>
              )}
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-400">Marca de la Máquina</label>
              <input
                type="text"
                value={nombreMaquina}
                readOnly
                className={`w-full mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                  isMaquinaValida ? "bg-green-200" : "bg-gray-100"
                } text-gray-900 font-bold`}
                placeholder="Este campo se llenará automáticamente"
              />
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-400">Ubicación de la Máquina</label>
              <input
                type="text"
                value={ubicacionMaquina}
                readOnly
                className={`w-full mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                  isMaquinaValida ? "bg-green-200" : "bg-gray-100"
                } text-gray-900 font-semibold`}
                placeholder="Este campo se llenará automáticamente"
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
            <label className="block font-bold mb-2">Archivo Adjunto {"(Opcional)"}</label>
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
