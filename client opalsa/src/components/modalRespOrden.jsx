import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalRespOrden = ({ isOpen, onClose, orden }) => {
  const [descripcionOrden, setDescripcionOrden] = useState('');
  const [nroSerieMaquina, setNroSerieMaquina] = useState('');
  const [ubicacionMaquina, setUbicacionMaquina] = useState('');
  const [usuario, setUsuario] = useState({});
  const [numeroOrden, setNumeroOrden] = useState('');
  const [fechaOrden, setFechaOrden] = useState('');
  const[fechaCumplimiento, setFechaCumplimiento] = useState('');
  const [elementoOrden, setElementosOrden] = useState([]);
  const [componentesAsignados, setComponentsAsign] = useState([]);
  const [tareaRealizada, setTareaRealizadas] = useState('');
  const [componentesSobrantes, setComponenteSobran] = useState([]);
  const [elementoOrdenSobrantes, setElementSobran] = useState([]);

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
          setElementosOrden(response.data.elementoOrden || []);
          setElementSobran(response.data.elementoOrdenSobrantes || []);
          setComponentsAsign(response.data.componentesAsignados || []);
          setComponenteSobran(response.data.componentesSobrantes || []);
          setTareaRealizadas(response.data.tareaRealizada);
          setFechaCumplimiento(response.data.fechaCumplimiento);
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
          
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b ">
            <p className="text-gray-600">Cargo</p>
            <p>{usuario.cargo || 'No disponible'}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b ">
            <p className="text-gray-600">Tarea Realizada</p>
            <p>{tareaRealizada}</p>
          </div>
          <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
  <p className="text-gray-600">Fecha Cumplimiento</p>
  <p>
    {fechaCumplimiento 
      ? new Date(new Date(fechaCumplimiento).getTime() + new Date(fechaCumplimiento).getTimezoneOffset() * 60000).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
      : "Aún no hay fecha"}
  </p>
</div>



          <div className='flex justify-between border-b pr-[227px] hover:bg-gray-50 '>
  {/* Elementos Asignados */}
  <div className="md:space-y-0 space-y-1 p-4">
    <p className="text-gray-600">Elementos Asignados</p>
    <ul>
      {elementoOrden.length > 0 ? (
        elementoOrden.map((element, index) => (
          <li key={index}>
           Nombre: {element.nombre || 'No hay Elemento'} - Cantidad: {element.cantidad || 'Cantidad no disponible'}
          </li>
        ))
      ) : (
        <li>No hay Elementos Asignados</li>
      )}
    </ul>
  </div>

  {/* Componentes Asignados */}
  <div className="md:space-y-0 space-y-1 p-4">
    <p className="text-gray-600">Componentes Asignados</p>
    <ul>
      {componentesAsignados.length > 0 ? (
        componentesAsignados.map((comp, index) => (
          <li key={index}>
            {comp.nombreComponente || 'No hay nombre del componente'} - {comp.serialComponente || 'No hay serial'}
          </li>
        ))
      ) : (
        <li>No hay Componentes Asignados</li>
      )}
    </ul>
  </div>
</div>

             <div className='flex justify-between border-b pr-[227px] hover:bg-gray-50 '>
  {/* Elementos Sobrantes */}
  <div className="md:space-y-0 space-y-1 p-4">
    <p className="text-gray-600">Elementos Sobrantes</p>
    <ul>
      {elementoOrdenSobrantes.length > 0 ? (
        elementoOrdenSobrantes.map((elementSobra, index) => (
          <li key={index}>
            Nombre: {elementSobra.nombre || 'No hay Elemento'} - Cantidad: {elementSobra.cantidadSobrante || 'Cantidad no disponible'}
          </li>
        ))
      ) : (
        <li>No hay Elementos Sobrantes</li>
      )}
    </ul>
  </div>

  {/* Componentes Sobrantes */}
  <div className="md:space-y-0 space-y-1 p-4">
    <p className="text-gray-600">Componentes Sobrantes</p>
    <ul>
      {componentesSobrantes.length > 0 ? (
        componentesSobrantes.map((compSobra, index) => (
          <li key={index}>
            {compSobra.nombreComponente || 'No hay nombre del componente'} - {compSobra.serialComponente || 'No hay serial'}
          </li>
        ))
      ) : (
        <li>No hay Componentes Sobrantes</li>
      )}
    </ul>
  </div>
</div>

        </form>
        
        <div className="flex justify-center mt-5">
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={onClose}>
          Cerrar
        </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRespOrden;
