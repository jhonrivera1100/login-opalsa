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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Mantenimientos</h2>
      <ul className="space-y-4">
        {mantenimientos.map((mantenimiento) => (
          <li key={mantenimiento._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-300">
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
              className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
              onClick={() => handleDelete(mantenimiento._id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MantenimientosList;