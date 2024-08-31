import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import { getComponentesRequest } from '../api/componentes';

const ModalOrden = ({ onClose, orden }) => {
  const [componentes, setComponentes] = useState([]);
  const [selectedComponentes, setSelectedComponentes] = useState([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Definir componentesData aquí
    const componentesData = selectedComponentes.map((componente) => ({
      serialComponente: componente.value,
      nombreComponente: componente.label,
    }));
  
    try {
      // Actualizar la orden sin cambiar el usuario
      const updateResponse = await axios.put(`http://localhost:4000/api/ordenes/${orden._id}`, {
        fechaOrden: new Date(),
        descripcionOrden: orden.descripcionOrden,
        nroSerieMaquina: orden.nroSerieMaquina,
        ubicacionMaquina: orden.ubicacionMaquina,
        usuario: user.username,  // Asegúrate de que el nombre de usuario es el correcto
        componentes: componentesData,
      });
  
      console.log('Orden actualizada:', updateResponse.data);
  
      // Obtener la orden actualizada
      const getResponse = await axios.get(`http://localhost:4000/api/ordenes/${orden._id}`);
      console.log('Datos de la orden actualizada:', getResponse.data);
  
      onClose(); // Cerrar el modal después de enviar
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
              <strong>Descripción de la Orden:</strong> {orden.descripcionOrden}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Maquina Serial:</strong> {orden.nroSerieMaquina}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Ubicación de la Maquina:</strong> {orden.ubicacionMaquina}
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
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalOrden;
