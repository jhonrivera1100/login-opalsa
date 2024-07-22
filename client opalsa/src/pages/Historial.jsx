import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import { FaTools } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { MdAutoAwesomeMotion } from "react-icons/md";
import { MdCasino } from "react-icons/md";

const Historial = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mantenimientosResponse = await axios.get('http://localhost:4000/api/mantenimientos');
        const movimientosResponse = await axios.get('http://localhost:4000/api/movimientos');
        const moviMaquinasResponse = await axios.get('http://localhost:4000/api/moviMaquinas');

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

        const moviMaquinasWithDetails = moviMaquinasResponse.data.map((moviMaquina) => ({
          ...moviMaquina,
          type: 'moviMaquina',
          fecha: new Date(moviMaquina.fechaTransferencia),
        }));

        const combinedItems = [...mantenimientosWithDetails, ...movimientosWithDetails, ...moviMaquinasWithDetails];

        combinedItems.sort((a, b) => b.fecha - a.fecha);

        setItems(combinedItems);
        setFilteredItems(combinedItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const deleteItem = async (id, type) => {
    try {
      if (type === 'mantenimiento') {
        await axios.delete(`http://localhost:4000/api/mantenimientos/${id}`);
      } else if (type === 'movimiento') {
        await axios.delete(`http://localhost:4000/api/movimientos/${id}`);
      } else if (type === 'moviMaquina') {
        await axios.delete(`http://localhost:4000/api/moviMaquinas/${id}`);
      }
      setItems(items.filter(item => item._id !== id));
      setFilteredItems(filteredItems.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    let filtered = items;

    if (filter !== 'all') {
      filtered = items.filter(item => item.type === filter);
    }

    if (filter === 'mantenimiento') {
      filtered = filtered.filter(item => item.nroSerieMaquina.toLowerCase().includes(query));
    } else if (filter === 'movimiento') {
      filtered = filtered.filter(item => item.serialComponente.toLowerCase().includes(query));
    } else if (filter === 'moviMaquina') {
      filtered = filtered.filter(item => item.serialMaquina.toLowerCase().includes(query));
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    let filtered = items;

    if (filter !== 'all') {
      filtered = items.filter(item => item.type === filter);
    }

    if (searchQuery) {
      if (filter === 'mantenimiento') {
        filtered = filtered.filter(item => item.nroSerieMaquina.toLowerCase().includes(searchQuery));
      } else if (filter === 'movimiento') {
        filtered = filtered.filter(item => item.serialComponente.toLowerCase().includes(searchQuery));
      } else if (filter === 'moviMaquina') {
        filtered = filtered.filter(item => item.serialMaquina.toLowerCase().includes(searchQuery));
      }
    }

    setFilteredItems(filtered);
  }, [filter, items, searchQuery]);

  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
      <header className="flex items-center justify-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          MANTENIMIENTOS<span className="text-sidebar-100 drop-shadow-xl"> Y MOVIMIENTOS</span>
        </h1>
      </header>
      <div className="max-w-7xl mx-auto mt-5 p-6 pl-[75px]">
        <div className="flex justify-center mb-4">
          <button
            className={`mx-2 px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`mx-2 px-4 py-2 rounded ${filter === 'mantenimiento' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('mantenimiento')}
          >
            Mantenimientos
          </button>
          <button
            className={`mx-2 px-4 py-2 rounded ${filter === 'movimiento' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('movimiento')}
          >
            Movimientos de Componentes
          </button>
          <button
            className={`mx-2 px-4 py-2 rounded ${filter === 'moviMaquina' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('moviMaquina')}
          >
            Movimientos de Máquinas
          </button>
        </div>
        <div className="flex justify-center mb-9 pt-7 ">
          <input 
            type="text" 
            className="px-4 py-2 border rounded w-[500px]"
            placeholder="Buscar Numero de Serie"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredItems.map((item) => (
            <div key={item._id} className="relative bg-white py-6 px-6 rounded-3xl w-[250px] shadow-xl m-4">
              <div className={`text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl ${item.type === 'mantenimiento' ? 'bg-green-500' : item.type === 'movimiento' ? 'bg-blue-500' : 'bg-yellow-500'} left-4 -top-6`}>
                {item.type === 'mantenimiento' ? <FaTools className="h-8 w-8" /> : item.type === 'movimiento' ? <MdAutoAwesomeMotion className="h-8 w-8" /> : <div className="h-8 w-8 bg-yellow-500 rounded-full "><MdCasino className="h-8 w-8" /></div>}
              </div>
              <div className="mt-8">
                <p className="text-xl font-semibold my-2">{item.type === 'mantenimiento' ? 'Mantenimiento' : item.type === 'movimiento' ? 'Movimiento de Componente' : 'Movimiento de Máquina'}</p>
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
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Número de Serie</p>
                      <p className="text-sm text-gray-500">{item.nroSerieMaquina}</p>
                    </div>
                    {item.nombreMaquina && (
                      <div className="my-1">
                        <p className="font-semibold text-base mb-1">Nombre Máquina</p>
                        <p className="text-sm text-gray-500">{item.nombreMaquina}</p>
                      </div>
                    )}
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
                ) : item.type === 'movimiento' ? (
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
                      <p className="font-semibold text-base mb-1">Serial Máquina Inicial</p>
                      <p className="text-sm text-gray-500">{item.oldMaquinaSerial}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Serial Máquina Final</p>
                      <p className="text-sm text-gray-500">{item.newMaquinaSerial}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Fecha de Transferencia</p>
                      <p className="text-sm text-gray-500">{item.fecha.toLocaleDateString()}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Serial Máquina</p>
                      <p className="text-sm text-gray-500">{item.serialMaquina}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Marca Máquina</p>
                      <p className="text-sm text-gray-500">{item.marcaMaquina}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Casino Inicial</p>
                      <p className="text-sm text-gray-500">{item.oldCasinoNombre}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Casino Final</p>
                      <p className="text-sm text-gray-500">{item.newCasinoNombre}</p>
                    </div>
                    <div className="my-1">
                      <p className="font-semibold text-base mb-1">Fecha de Transferencia</p>
                      <p className="text-sm text-gray-500">{item.fecha.toLocaleDateString()}</p>
                    </div>
                  </>
                )}
                <button
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => deleteItem(item._id, item.type)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Historial;
