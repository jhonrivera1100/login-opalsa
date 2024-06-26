import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const MovimientosLista = () => {
  const [movimientos, setMovimientos] = useState([]);

  const fetchMovimientos = async () => {
    try {
      const response = await axios.get('/movimientos');
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/movimientos/${id}`);
      setMovimientos(prevMovimientos => prevMovimientos.filter(movimiento => movimiento._id !== id));
      console.log('Movimiento eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el movimiento:', error);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {movimientos.map(movimiento => (
          <div key={movimiento._id} className="relative bg-white py-6 px-6 rounded-3xl w-[250px] shadow-xl m-4">
            <div className="text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-blue-500 left-4 -top-6">
              {/* svg */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="mt-8">
              <p className="text-xl font-semibold my-2">Movimiento de Componente</p>
              <div className="my-1">
                <p className="font-semibold text-base mb-2">Nombre Componente</p>
                <p className="text-sm text-gray-500">{movimiento.nombreComponente}</p>
              </div>
              <div className="my-1">
                <p className="font-semibold text-base mb-2">Serial Componente</p>
                <p className="text-sm text-gray-500">{movimiento.serialComponente}</p>
              </div>
              <div className="my-1">
                <p className="font-semibold text-base mb-2">Serial Maquina Inicial</p>
                <p className="text-sm text-gray-500">{movimiento.oldMaquinaSerial}</p>
              </div>
              <div className="my-1">
                <p className="font-semibold text-base mb-2">Serial Maquina Final</p>
                <p className="text-sm text-gray-500">{movimiento.newMaquinaSerial}</p>
              </div>
              <div className="my-1">
                <p className="font-semibold text-base mb-2">Fecha de Transferencia</p>
                <p className="text-sm text-gray-500">{new Date(movimiento.fechaTransferencia).toLocaleDateString()}</p>
              </div>
              <div className=' flex justify-center'>
              <button
                className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                onClick={() => handleDelete(movimiento._id)}
              >
                Eliminar
              </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovimientosLista;
