import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const HistorialComponentes = () => {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/historial');
        setHistorial(response.data);
      } catch (error) {
        console.error('Error al obtener el historial de componentes:', error);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <div className="max-w-8xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Historial de movimientos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {historial.map((registro) => (
          <div key={registro._id} className="border border-gray-200 rounded-lg shadow-lg hover:shadow-md transition-shadow duration-300">
            <div className="bg-gray-900 text-white w-full py-2 px-2 text-center font-bold rounded-t-lg">
              <h3 className="text-lg font-bold">Movimiento</h3>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="space-y-2">
                <div>
                  <strong>Componente:</strong>
                  <div>{registro.nombreComponente}</div>
                </div>
                <div>
                  <strong>Serial del Componente:</strong>
                  <div>{registro.serialComponente}</div>
                </div>
                <div>
                  <strong>De Máquina:</strong>
                  <div>{registro.oldMaquinaSerial}</div>
                </div>
                <div>
                  <strong>A Máquina:</strong>
                  <div>{registro.newMaquinaSerial}</div>
                </div>
                <div>
                  <strong>Fecha de Transferencia:</strong>
                  <div>{new Date(registro.fechaTransferencia).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorialComponentes;
