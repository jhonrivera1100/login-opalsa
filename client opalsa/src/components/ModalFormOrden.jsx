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
  const [usuario, setUsuario] = useState(orden.usuario || '');
  const [sobrantes, setSobrantes] = useState(orden.sobrantes || '');
  const [ordenId, setOrdenId] = useState(orden._id || ''); // Asegúrate de tener el ID de la orden
  const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
  const { user } = useAuth();

  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await getComponentesRequest();
        console.log('Componentes recibidos:', response.data);
        setComponentes(response.data);
      } catch (err) {
        console.error('Error al obtener los Componentes:', err);
      }
    };

    fetchComponentes();
  }, []);

  const handleComponentesChange = (selectedOptions) => {
    setSelectedComponentes(selectedOptions || []);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene la actualización de la página

    const componentesAsignados = selectedComponentes.map((comp) => ({
      serialComponente: comp.value,
      nombreComponente: comp.label,
    }));

    try {
      const response = await axios.put(`http://localhost:4000/api/ordenes/${ordenId}`, {
        fechaOrden: new Date(), // Ajusta si es necesario
        descripcionOrden,
        nroSerieMaquina,
        ubicacionMaquina,
        usuario,
        componentes: selectedComponentes.map(comp => comp.value), // Envia los valores seleccionados
        componentesAsignados,
        sobrantes,
        estadoOrden: 'Orden aceptada en proceso' // Actualiza el campo estadoOrden
      });
      console.log('Orden actualizada:', response.data);
      if (typeof onOrderAccepted === 'function') {
        onOrderAccepted(response.data); // Llama al callback solo si es una función
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
    value: componente.serialComponente,
    label: componente.nombreComponente,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h3 className="text-lg font-bold mb-4">Enviar Orden</h3>
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 mt-5">
            <Select
              value={selectedComponentes}
              onChange={handleComponentesChange}
              options={componenteOptions}
              isMulti
              className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Selecciona los Componentes"
            />
            <div className="mt-4">
              <h4 className="text-gray-600 mb-2 font-bold">Componentes Seleccionados:</h4>
              <ul className="list-disc pl-5">
                {selectedComponentes.map((componente, index) => (
                  <li key={index} className="text-gray-600">
                    {componente.label} (Serial: {componente.value})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 mb-2">
              <strong>Descripción de la Orden:</strong> {descripcionOrden}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Maquina Serial:</strong> {nroSerieMaquina}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Ubicación de la Maquina:</strong> {ubicacionMaquina}
            </p>
            <p className="text-gray-600 mb-2 pb-2">
              <strong>Usuario:</strong> {user.username}
            </p>
          </div>
          <div className="flex justify-end space-x-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalOrden;
