import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const ModalSobrantes = ({ item, onClose }) => {
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [sobrantes, setSobrantes] = useState(item.sobrantes || '');
  const [componentesAsignados, setComponentesAsignados] = useState([]);

  useEffect(() => {
    if (item && item.componentesAsignados) {
      setComponentesAsignados(item.componentesAsignados);
    }
  }, [item]);

  // Convertir los componentes asignados a un formato que `react-select` pueda usar
  const componentOptions = componentesAsignados.map((componente) => ({
    value: componente.serialComponente,
    label: `${componente.nombreComponente} (${componente.serialComponente})`
  }));

  const handleComponentesChange = (selectedOptions) => {
    setSelectedComponents(selectedOptions || []);
  };

  const handleSobrantesChange = (e) => {
    setSobrantes(e.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene la actualización de la página
  
    const data = {
      componentesAsignados: selectedComponents.map(comp => comp.value),
      sobrantes,
      componenteSobrantes: selectedComponents.map(comp => ({ 
        serialComponente: comp.value,
        nombreComponente: comp.label.split(' (')[0]
      }))
    };
  
    try {
      // Usa la ruta correcta según la configuración del backend
      const response = await axios.put(`http://localhost:4000/api/ordenes/${item._id}/sobrantes`, data);
      console.log('Orden actualizada:', response.data);
    } catch (error) {
      console.error('Error al actualizar la orden:', error.response ? error.response.data : error.message);
    }
  
    onClose(); // Cierra el modal después de manejar la selección
  };
  

  
  
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h3 className="text-lg font-bold mb-4">Seleccionar Componentes y Sobrantes</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 mt-5">
            <div className="mb-4">
              <label htmlFor="componentes" className="block text-sm font-medium text-gray-700">Componentes:</label>
              <Select
                id="componentes"
                value={selectedComponents}
                onChange={handleComponentesChange}
                options={componentOptions}
                isMulti
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Selecciona los Componentes"
              />
            </div>
            <div>
              <label htmlFor="sobrantes" className="block text-sm font-medium text-gray-700">Partes Sobrantes:</label>
              <input 
                type="text"
                id="sobrantes"
                value={sobrantes}
                onChange={handleSobrantesChange}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline mb-7"
                placeholder="Otras partes sobrantes devueltas"
              />
            </div>
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

export default ModalSobrantes;
