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
                const machineResponse = await axios.get(`http://localhost:4000/api/maquinas/nroSerie/${mantenimiento.nroSerieMaquina}`);
                return {
                  ...mantenimiento,
                  nombreMaquina: machineResponse.data.nombreMaquina,
                  ubicacionMaquina: machineResponse.data.ubicacionMaquina,
                };
              } catch (error) {
                console.error(`Error al obtener detalles de la máquina con número de serie ${mantenimiento.nroSerieMaquina}:`, error);
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Mantenimientos</h2>
      <ul>
        {mantenimientos.map((mantenimiento) => (
          <li key={mantenimiento._id} className="border border-gray-300 rounded-md p-2 mb-2 flex justify-between items-center">
            <div>
              <strong>Tipo:</strong> {mantenimiento.tipoMantenimiento}, 
              <strong>Fecha:</strong> {new Date(mantenimiento.fechaMantenimiento).toLocaleDateString()}, 
              <strong>Descripción:</strong> {mantenimiento.descripcion}, 
              {mantenimiento.nombreMaquina && (
                <>
                  <strong>Nombre de la Máquina:</strong> {mantenimiento.nombreMaquina}, 
                </>
              )}
              <strong>Número de Serie:</strong> {mantenimiento.nroSerieMaquina}, 
              {mantenimiento.ubicacionMaquina && (
                <>
                  <strong>Ubicación:</strong> {mantenimiento.ubicacionMaquina}, 
                </>
              )}
              <strong>Documento:</strong> {mantenimiento.archivo && (
                <a href={`http://localhost:4000/upload/${mantenimiento.archivo}`} target="_blank" rel="noopener noreferrer">
                  {mantenimiento.archivo}
                </a>
              )}
            </div>
            <button
              className="bg-red-500 text-white py-1 px-2 rounded-md"
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