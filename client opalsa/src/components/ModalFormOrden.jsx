import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import { getComponentesRequest } from '../api/componentes';

const ModalOrden = ({ onClose, orden, onOrderAccepted }) => {
  const [componentes, setComponentes] = useState([]);
  const [selectedComponentes, setSelectedComponentes] = useState([]);
  const [descripcionOrden, setDescripcionOrden] = useState(orden.descripcionOrden || '');
  const [nroSerieMaquina, setNroSerieMaquina] = useState(orden.nroSerieMaquina || '');
  const [ubicacionMaquina, setUbicacionMaquina] = useState(orden.ubicacionMaquina || '');
  const [usuario, setUsuario] = useState({});
  const [ordenId, setOrdenId] = useState(orden._id || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [elementosOrden, setElementosOrden] = useState(orden.elementoOrden || []);
  const [numeroOrden, setNumeroOrden] = useState(orden.numeroOrden || '');
  const [fechaOrden, setFechaOrden] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await getComponentesRequest();
        setComponentes(response.data);
      } catch (err) {
        console.error('Error al obtener los Componentes:', err);
      }
    };

    const fetchOrden = async () => {
      try {
        if (ordenId) {
          const response = await axios.get(`http://localhost:4000/api/ordenes/${ordenId}`).then(res => res.data);
          setDescripcionOrden(response.descripcionOrden);
          setNroSerieMaquina(response.maquina ? response.maquina.nroSerieMaquina : 'Desconocido');
          setUbicacionMaquina(response.maquina ? response.maquina.ubicacionMaquina : 'Desconocida');
          setElementosOrden(response.elementoOrden);
          setUsuario(response.usuario);
          setNumeroOrden(response.numeroOrden);
          setFechaOrden(new Date(response.fechaOrden).toLocaleDateString());

          // Actualizar selectedComponentes con los componentes ya asignados a la orden
          const componentesSeleccionados = response.componentesAsignados.map(component => ({
            value: component.serialComponente,
            label: `${component.nombreComponente} (Serial: ${component.serialComponente})`,
          }));
          setSelectedComponentes(componentesSeleccionados);
        }
      } catch (err) {
        console.error('Error al obtener la orden:', err);
      }
    };

    fetchComponentes();
    fetchOrden();
  }, [ordenId]);

  const handleComponentesChange = (selectedOptions) => {
    setSelectedComponentes(selectedOptions || []);
  };

  const handleElementosChange = (index, field, value) => {
    const newElementosOrden = [...elementosOrden];
    newElementosOrden[index] = { ...newElementosOrden[index], [field]: value };
    setElementosOrden(newElementosOrden);
  };

  const handleAddElemento = () => {
    setElementosOrden([...elementosOrden, { nombre: '', cantidad: 0 }]);
  };

  const handleRemoveElemento = (index) => {
    setElementosOrden(elementosOrden.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const componentesAsignados = selectedComponentes.map(component => ({
      nombreComponente: component.label.split(' (Serial:')[0],
      serialComponente: component.value,
    }));

    try {
      const response = await axios.put(`http://localhost:4000/api/ordenes/${ordenId}`, {
        fechaOrden: new Date(),
        descripcionOrden,
        nroSerieMaquina,
        ubicacionMaquina,
        usuario: usuario._id, 
        estadoOrden: 'Orden aprobada',
        elementoOrden: elementosOrden,
        componentesAsignados,
      });

      if (typeof onOrderAccepted === 'function') {
        onOrderAccepted(response.data);
      }
      setSuccessMessage('Orden aceptada y enviada exitosamente');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error al actualizar la orden:', error.response ? error.response.data : error.message);
    }
  };

  const componenteOptions = componentes.map((componente) => ({
    value: componente._id,
    label: `${componente.nombreComponente} (Serial: ${componente.serialComponente})`,
    marcaComponente: componente.marcaComponente,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6">
        <div className="p-4 border-b mb-4">
          <h2 className="text-2xl font-semibold">Detalles de la Orden</h2>
          <p className="text-sm text-gray-500">Revisa y completa la información de la orden</p>
        </div>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <div className="mt-4">
            <h4 className="text-gray-600 mb-2 font-bold">Asignar componentes</h4>
            <Select
              isMulti
              name="componentes"
              options={componenteOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedComponentes} // Mostrar los componentes ya seleccionados
              onChange={handleComponentesChange}
              placeholder="Selecciona componentes"
            />
          </div>

          <div className="mt-4">
            <h4 className="text-gray-600 mb-2 font-bold">Asignar elementos</h4>
            {elementosOrden.map((elemento, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={elemento.nombre}
                  onChange={(e) => handleElementosChange(index, 'nombre', e.target.value)}
                  placeholder="Nombre del Elemento"
                  className="px-4 py-2 border rounded mr-2 w-1/2"
                />
                <input
                  type="number"
                  value={elemento.cantidad}
                  onChange={(e) => handleElementosChange(index, 'cantidad', e.target.value)}
                  placeholder="Cantidad"
                  className="px-4 py-2 border rounded mr-2 w-1/4"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveElemento(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddElemento}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Añadir Elemento
            </button>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Guardar Orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalOrden;
