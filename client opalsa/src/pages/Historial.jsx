import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import { FaTools } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";

const Historial = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mantenimientosResponse = await axios.get('http://localhost:4000/api/mantenimientos');
        const movimientosResponse = await axios.get('http://localhost:4000/api/movimientos');

        const mantenimientosWithDetails = await Promise.all(
          mantenimientosResponse.data.map(async (mantenimiento) => {
            if (mantenimiento.nroSerieMaquina) {
              try {
                const machineResponse = await axios.get(`http://localhost:4000/api/maquinas/${mantenimiento.nroSerieMaquina}`);
                return {
                  ...mantenimiento,
                  nombreMaquina: machineResponse.data.nombreMaquina,
                  ubicacionMaquina: machineResponse.data.ubicacionMaquina,
                  type: 'mantenimiento',
                  fecha: new Date(mantenimiento.fechaMantenimiento),
                };
              } catch (error) {
                return {
                  ...mantenimiento,
                  type: 'mantenimiento',
                  fecha: new Date(mantenimiento.fechaMantenimiento),
                };
              }
            } else {
              return {
                ...mantenimiento,
                type: 'mantenimiento',
                fecha: new Date(mantenimiento.fechaMantenimiento),
              };
            }
          })
        );

        const movimientosWithDetails = movimientosResponse.data.map((movimiento) => ({
          ...movimiento,
          type: 'movimiento',
          fecha: new Date(movimiento.fechaTransferencia),
        }));

        const combinedItems = [...mantenimientosWithDetails, ...movimientosWithDetails];

        // Ordenar los elementos combinados por la fecha unificada
        combinedItems.sort((a, b) => b.fecha - a.fecha);

        setItems(combinedItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
      <header className="flex items-center justify-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          MANTENIMIENTOS<span className="text-sidebar-100 drop-shadow-xl"> Y MOVIMIENTOS</span>
        </h1>
      </header>
      <div className="max-w-7xl mx-auto mt-5 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {items.map((item) => (
            <div key={item._id} className="relative bg-white py-6 px-6 rounded-3xl w-[250px] shadow-xl m-4">
              <div className={`text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl ${item.type === 'mantenimiento' ? 'bg-green-500' : 'bg-blue-500'} left-4 -top-6`}>
                {item.type === 'mantenimiento' ? <FaTools className="h-8 w-8" /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
              </div>
              <div className="mt-8">
                <p className="text-xl font-semibold my-2">{item.type === 'mantenimiento' ? 'Mantenimiento' : 'Movimiento de Componente'}</p>
                {item.type === 'mantenimiento' ? (
                  <>
                    <div className="flex space-x-2 text-gray-400 text-sm">
                      <CgWebsite />
                      <p>{item.tipoMantenimiento}</p>
                    </div>
                    <div className="flex space-x-2 text-gray-400 text-sm my-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>{item.fecha.toLocaleDateString()}</p>
                    </div>
                    <div className="border-t-2"></div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Descripción</p>
                      <p className="text-sm text-gray-500">{item.descripcion}</p>
                    </div>
                    {item.nombreMaquina && (
                      <div className="my-1">
                        <p className="font-semibold text-base mb-1">Nombre de la Máquina</p>
                        <p className="text-sm text-gray-500">{item.nombreMaquina}</p>
                      </div>
                    )}
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Número de Serie</p>
                      <p className="text-sm text-gray-500">{item.nroSerieMaquina}</p>
                    </div>
                    {item.ubicacionMaquina && (
                      <div className="my-1">
                        <p className="font-semibold text-base mb-1">Ubicación</p>
                        <p className="text-sm text-gray-500">{item.ubicacionMaquina}</p>
                      </div>
                    )}
                    {item.archivo && (
                      <div className="my-1">
                        <p className="font-semibold text-base mb-1">Documento</p>
                        <a href={`http://localhost:4000/upload/${item.archivo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                          {item.archivo}
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Nombre Componente</p>
                      <p className="text-sm text-gray-500">{item.nombreComponente}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Serial Componente</p>
                      <p className="text-sm text-gray-500">{item.serialComponente}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Serial Maquina Inicial</p>
                      <p className="text-sm text-gray-500">{item.oldMaquinaSerial}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Serial Maquina Final</p>
                      <p className="text-sm text-gray-500">{item.newMaquinaSerial}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Fecha de Transferencia</p>
                      <p className="text-sm text-gray-500">{item.fecha.toLocaleDateString()}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Historial;
