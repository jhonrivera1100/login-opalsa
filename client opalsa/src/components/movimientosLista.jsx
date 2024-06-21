import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const MovimientosLista = () => {
  const [movimientos, setMovimientos] = useState([]);

  const fetchMovimientos = async () => {
    try {
      const response = await axios.get('/movimientos'); // Asegúrate de que esta ruta sea correcta
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
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {movimientos.map(movimiento => (
        <div key={movimiento._id} className="border border-gray-200 rounded-lg shadow-lg hover:shadow-md transition-shadow duration-300">
          <div className="bg-blue-500 text-white w-[300px] py-2 px-2 text-center font-bold rounded-t-lg">
            <h3 className="text-lg font-bold">Movimiento de Componente</h3>
          </div>
          <div className="p-6 w-[300px] bg-gray-50">
            <div className="space-y-2">
              <div>
                <strong>Nombre del Componente:</strong>
                <div>{movimiento.nombreComponente}</div>
              </div>
              <div>
                <strong>Serial del Componente:</strong>
                <div>{movimiento.serialComponente}</div>
              </div>
              <div>
                <strong>Serial Maquina nicial:</strong>
                <div>{movimiento.oldMaquinaSerial}</div>
              </div>
              <div>
                <strong>Serial Maquina Final:</strong>
                <div>{movimiento.newMaquinaSerial}</div>
              </div>
              <div>
                <strong>Fecha de Transferencia:</strong>
                <div>{new Date(movimiento.fechaTransferencia).toLocaleDateString()}</div>
              </div>
            </div>
            <button
              className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
              onClick={() => handleDelete(movimiento._id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default MovimientosLista;
