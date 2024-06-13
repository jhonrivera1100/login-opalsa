import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const HistorialComponentes = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('/historial');
        setHistorial(response.data);
      } catch (error) {
        console.error('Error al obtener el historial:', error);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div className="max-w-8xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Historial de Componentes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {historial.map((registro) => (
          <div key={registro._id} className="border border-gray-200 rounded-lg shadow-lg hover:shadow-md transition-shadow duration-300">
            <div className="bg-gray-900 text-white w-full py-2 px-2 text-center font-bold rounded-t-lg">
              <h3 className="text-lg font-bold">Cambio de Componente</h3>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="space-y-2">
                <p><strong>Componente:</strong> {registro.nombreComponente}</p>
                <p><strong>Serial Componente:</strong> {registro.serialComponente}</p>
                <p><strong>Máquina Anterior:</strong> {registro.oldMaquinaSerial}</p>
                <p><strong>Máquina Nueva:</strong> {registro.newMaquinaSerial}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialComponentes;
