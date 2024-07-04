import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTools } from 'react-icons/fa';
import { CgWebsite } from 'react-icons/cg';

const MovimientosYMantenimientosLista = () => {
  // Estado para movimientos
  const [movimientos, setMovimientos] = useState([]);

  // Estado para mantenimientos
  const [mantenimientos, setMantenimientos] = useState([]);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);

  // Función para obtener movimientos
  const fetchMovimientos = async () => {
    try {
      const response = await axios.get('/movimientos');
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error al obtener los movimientos:', error);
    }
  };

  // Función para eliminar un movimiento
  const handleDeleteMovimiento = async (id) => {
    try {
      await axios.delete(`/movimientos/${id}`);
      setMovimientos((prevMovimientos) =>
        prevMovimientos.filter((movimiento) => movimiento._id !== id)
      );
      console.log('Movimiento eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el movimiento:', error);
    }
  };

  // Función para obtener mantenimientos
  const fetchMantenimientos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/mantenimientos');

      const mantenimientosWithMachineDetails = await Promise.all(
        response.data.map(async (mantenimiento) => {
          if (mantenimiento.nroSerieMaquina) {
            try {
              const machineResponse = await axios.get(
                `http://localhost:4000/api/maquinas/${mantenimiento.nroSerieMaquina}`
              );
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

  // Función para eliminar un mantenimiento
  const handleDeleteMantenimiento = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/mantenimientos/${id}`);
      setMantenimientos((prevMantenimientos) =>
        prevMantenimientos.filter((mantenimiento) => mantenimiento._id !== id)
      );
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
    }
  };

  // Función para abrir el modal de detalles de mantenimiento
  const handleOpenModal = (mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
  };

  // Función para cerrar el modal de detalles de mantenimiento
  const handleCloseModal = () => {
    setSelectedMantenimiento(null);
  };

  // Efecto para cargar los movimientos al montar el componente
  useEffect(() => {
    fetchMovimientos();
  }, []);
  
  useEffect(() => {
    fetchMantenimientos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-2 p-6">
      {/* Sección de Movimientos */}
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Movimientos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {movimientos.map((movimiento) => (
            <div
              key={movimiento._id}
              className="relative bg-white py-6 px-6 rounded-3xl w-[250px] shadow-xl m-4"
            >
              <div className="text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-blue-500 left-4 -top-6">
                <FaTools className="h-8 w-8" />
              </div>
              <div className="mt-8">
                <p className="text-xl font-semibold my-2">Movimiento de Componente</p>
                <div className="my-1">
                  <p className="font-semibold text-base mb-1">Nombre Componente</p>
                  <p className="text-sm text-gray-500">{movimiento.nombreComponente}</p>
                </div>
                <div className="my-1">
                  <p className="font-semibold text-base mb-1">Serial Componente</p>
                  <p className="text-sm text-gray-500">{movimiento.serialComponente}</p>
                </div>
                <div className="my-1">
                  <p className="font-semibold text-base mb-1">Serial Maquina Inicial</p>
                  <p className="text-sm text-gray-500">{movimiento.oldMaquinaSerial}</p>
                </div>
                <div className="my-1">
                  <p className="font-semibold text-base mb-1">Serial Maquina Final</p>
                  <p className="text-sm text-gray-500">{movimiento.newMaquinaSerial}</p>
                </div>
                <div className="my-1">
                  <p className="font-semibold text-base mb-1">Fecha de Transferencia</p>
                  <p className="text-sm text-gray-500">
                    {new Date(movimiento.fechaTransferencia).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                    onClick={() => handleDeleteMovimiento(movimiento._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Mantenimientos */}
      <div>
        <h2 className="text-2xl mb-4">Mantenimientos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {mantenimientos.map((mantenimiento) => (
            <div
              key={mantenimiento._id}
              className="relative bg-white py-6 px-6 rounded-3xl w-[250px] h-[435px] m-4 shadow-xl"
            >
              <div className="text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-green-500 left-4 -top-6">
                <FaTools className="h-8 w-8" />
              </div>
              <div className="mt-8">
                <p className="text-xl font-semibold my-2">Mantenimiento</p>
                <div className="flex space-x-2 text-gray-400 text-sm">
                  <CgWebsite />
                  <p>{mantenimiento.tipoMantenimiento}</p>
                </div>
                <div className="flex space-x-2 text-gray-400 text-sm my-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>{new Date(mantenimiento.fechaMantenimiento).toLocaleDateString()}</p>
                </div>
                <div className="border-t-2"></div>
                <div className="my-1">
                  <p className="font-semibold text-base mb-1">Descripción</p>
                  <p
                    className="text-sm text-gray-500 cursor-pointer hover:text-gray-800 transition"
                    onClick={() => handleOpenModal(mantenimiento)}
                  >
                    {mantenimiento.descripcion.length > 25
                      ? `${mantenimiento.descripcion.substring(0, 25)}...`
                      : mantenimiento.descripcion}
                  </p>
                </div>
                {mantenimiento.nombreMaquina && (
                  <div className="my-1">
                    <p className="font-semibold text-base mb-1">Nombre de la Máquina</p>
                    <p className="text-sm text-gray-500">{mantenimiento.nombreMaquina}</p>
                  </div>
                )}
                <div className="my-1">
                  <p className="font-semibold text-base mb-1">Número de Serie</p>
                  <p className="text-sm text-gray-500">{mantenimiento.nroSerieMaquina}</p>
                </div>
                {mantenimiento.ubicacionMaquina && (
                  <div className="my-1">
                    <p className="font-semibold text-base mb-1">Ubicación</p>
                    <p className="text-sm text-gray-500">{mantenimiento.ubicacionMaquina}</p>
                  </div>
                )}
                {mantenimiento.archivo && (
                  <div className="my-1">
                    <p className="font-semibold text-base mb-1">Documento</p>
                    <a
                      href={`http://localhost:4000/upload/${mantenimiento.archivo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      {mantenimiento.archivo}
                    </a>
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                    onClick={() => handleDeleteMantenimiento(mantenimiento._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Modal de Detalles del Mantenimiento */}
        {selectedMantenimiento && (
          <Modal mantenimiento={selectedMantenimiento} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

// Componente de Modal de Detalles del Mantenimiento
const Modal = ({ mantenimiento, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Detalles del Mantenimiento</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>
          <p className="font-semibold text-lg mb-2">Descripción</p>
          <p className="text-sm text-gray-600">{mantenimiento.descripcion}</p>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default MovimientosYMantenimientosLista;
