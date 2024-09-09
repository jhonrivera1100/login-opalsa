import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalRespOrden = ({ isOpen, onClose, orden }) => {
  const [descripcionOrden, setDescripcionOrden] = useState('');
  const [nroSerieMaquina, setNroSerieMaquina] = useState('');
  const [ubicacionMaquina, setUbicacionMaquina] = useState('');
  const [usuario, setUsuario] = useState({});
  const [numeroOrden, setNumeroOrden] = useState('');
  const [fechaOrden, setFechaOrden] = useState('');

  useEffect(() => {
    if (isOpen && orden) {
      const fetchOrden = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/ordenes/${orden._id}`);
          setDescripcionOrden(response.data.descripcionOrden);
          setNroSerieMaquina(response.data.maquina ? response.data.maquina.nroSerieMaquina : 'Desconocido');
          setUbicacionMaquina(response.data.maquina ? response.data.maquina.ubicacionMaquina : 'Desconocida');
          setUsuario(response.data.usuario);
          setNumeroOrden(response.data.numeroOrden);
          setFechaOrden(new Date(response.data.fechaOrden).toLocaleDateString());
        } catch (err) {
          console.error('Error al obtener la orden:', err);
        }
      };

      fetchOrden();
    }
  }, [isOpen, orden]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6">
        <div className="p-4 border-b mb-4">
          <h2 className="text-2xl font-semibold">Detalles de la Orden</h2>
          <p className="text-sm text-gray-500">Revisa y completa la información de la orden</p>
        </div>
        
        <form>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Número de orden</p>
            <p>{numeroOrden}</p>
          </div>
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Fecha de la Orden</p>
            <p>{fechaOrden}</p>
          </div>
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Descripción de la Orden</p>
            <p>{descripcionOrden}</p>
          </div>
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Serial de la Maquina</p>
            <p>{nroSerieMaquina}</p>
          </div>
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Ubicación de la Maquina</p>
            <p>{ubicacionMaquina}</p>
          </div>
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Usuario</p>
            <p>{usuario.username || 'No disponible'}</p>
          </div>
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p className="text-gray-600">Correo</p>
            <p>{usuario.email || 'No disponible'}</p>
          </div>
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4">
            <p className="text-gray-600">Cargo</p>
            <p>{usuario.cargo || 'No disponible'}</p>
          </div>
        </form>
        <button className="mt-4 bg-teal-500 text-white px-4 py-2 rounded" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalRespOrden;