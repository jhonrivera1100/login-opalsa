import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getMaquinasRequest } from '../api/maquinas';
import Select from 'react-select';

const MantenimientoRegistro = () => {
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(null); // Guardar la máquina seleccionada
  const [tipoMantenimiento, setTipoMantenimiento] = useState('');
  const [fechaMantenimiento, setFechaMantenimiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 
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

  // Actualizar marca y ubicación de la máquina seleccionada
  const handleSerieChange = (selectedOption) => {
    if (selectedOption) {
      const selectedSerie = selectedOption.value;
      const selectedMaquina = maquinas.find(maquina => maquina.nroSerieMaquina === selectedSerie);
      
      if (selectedMaquina) {
        setMaquinaSeleccionada(selectedMaquina); // Actualizar con la máquina encontrada
      } else {
        setMaquinaSeleccionada(null);
      }
    } else {
      setMaquinaSeleccionada(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('tipoMantenimiento', tipoMantenimiento);
    formData.append('fechaMantenimiento', fechaMantenimiento);
    formData.append('descripcion', descripcion);
    formData.append('maquina', maquinaSeleccionada ? maquinaSeleccionada.nroSerieMaquina : ''); // Asegúrate de que se envía el número de serie correcto
    if (archivo) {
      formData.append('archivo', archivo);
    }
  
    try {
      const response = await axios.post('http://localhost:4000/api/mantenimientos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Mantenimiento creado:', response.data);
      setSuccessMessage('Mantenimiento registrado exitosamente');
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      setError('Error al registrar el mantenimiento.');
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
              value={maquinaOptions.find(option => option.value === (maquinaSeleccionada ? maquinaSeleccionada.nroSerieMaquina : ''))}
              onChange={handleSerieChange}
              options={maquinaOptions}
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Número de Serie"
            />
            <input
              type="text"
              value={maquinaSeleccionada ? maquinaSeleccionada.marcaMaquina : ''}
              readOnly
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Marca de la Máquina"
            />
            <input
              type="text"
              value={maquinaSeleccionada ? maquinaSeleccionada.ubicacionMaquina : ''}
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
          
          {/* Mostrar la alerta de éxito si successMessage existe */}
          <div className='mt-5'>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                <p>{successMessage}</p>
              </div>
            )}

            {/* Mostrar la alerta de error si error existe */}
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
