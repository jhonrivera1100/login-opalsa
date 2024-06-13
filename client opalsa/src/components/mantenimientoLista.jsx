import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MantenimientosList = () => {
  const [mantenimientos, setMantenimientos] = useState([]);

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/mantenimientos');
        
        const mantenimientosWithMachineDetails = await Promise.all(
          response.data.map(async (mantenimiento) => {
            if (mantenimiento.nroSerieMaquina) {
              try {
                const machineResponse = await axios.get(`http://localhost:4000/api/maquina/${mantenimiento.nroSerieMaquina}`);
                return {
                  ...mantenimiento,
                  nombreMaquina: machineResponse.data.nombreMaquina,
                  ubicacionMaquina: machineResponse.data.ubicacionMaquina,
                };
              } catch (error) {
                return mantenimiento; // Devolver el mantenimiento original si falla la solicitud
              }
            } else {
              return mantenimiento; // Devolver el mantenimiento original si no hay número de serie
            }
          })
        );

        setMantenimientos(mantenimientosWithMachineDetails);
      } catch (error) {
        console.error('Error al obtener mantenimientos:', error);
      }
    };

    fetchMantenimientos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/mantenimientos/${id}`);
      setMantenimientos(mantenimientos.filter((mantenimiento) => mantenimiento._id !== id));
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
    }
  };

  return (
    <div className="max-w-8xl mx-auto mt-10 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mantenimientos.map((mantenimiento) => (
          <div key={mantenimiento._id} className="border border-gray-200 rounded-lg shadow-lg hover:shadow-md transition-shadow duration-300">
            <div className="bg-gray-900 text-white w-full py-2 px-2 text-center font-bold rounded-t-lg">
              <h3 className="text-lg font-bold">Mantenimiento</h3>
            </div>
            <div className="p-4 bg-gray-50">
              <div className="space-y-2">
                <p><strong>Tipo:</strong> {mantenimiento.tipoMantenimiento}</p>
                <p><strong>Fecha:</strong> {new Date(mantenimiento.fechaMantenimiento).toLocaleDateString()}</p>
                <p><strong>Descripción:</strong> {mantenimiento.descripcion}</p>
                {mantenimiento.nombreMaquina && (
                  <p><strong>Nombre de la Máquina:</strong> {mantenimiento.nombreMaquina}</p>
                )}
                <p><strong>Número de Serie:</strong> {mantenimiento.nroSerieMaquina}</p>
                {mantenimiento.ubicacionMaquina && (
                  <p><strong>Ubicación:</strong> {mantenimiento.ubicacionMaquina}</p>
                )}
                {mantenimiento.archivo && (
                  <p>
                    <strong>Documento:</strong> 
                    <a href={`http://localhost:4000/upload/${mantenimiento.archivo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                      {mantenimiento.archivo}
                    </a>
                  </p>
                )}
              </div>
              <button
                className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                onClick={() => handleDelete(mantenimiento._id)}
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

export default MantenimientosList;
