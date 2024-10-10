import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const ModalSobrantes = ({ item, onClose }) => {
  const [selectedElementos, setSelectedElementos] = useState([]);
  const [elementoOrden, setElementoOrden] = useState([]);
  const [elementoOrdenSobrantes, setElementoOrdenSobrantes] = useState([]);
  const [tareaRealizada, setTareaRealizada] = useState("");
  const [componentesAsignados, setComponentesAsignados] = useState([]);
  const [componentesSobrantes, setComponentesSobrantes] = useState([]);
  const [fechaCumplimiento, setFechaCumplimiento] = useState("");

  useEffect(() => {
    if (item) {
      setTareaRealizada(item.tareaRealizada || "");
      setElementoOrden(item.elementoOrden || []);
      setElementoOrdenSobrantes(item.elementoOrdenSobrantes || []);
      setComponentesAsignados(item.componentesAsignados || []);
      setFechaCumplimiento(item.fechaCumplimiento || "");
      setSelectedElementos([]);
    }
  }, [item]);

  const elementoOptions = elementoOrden.map((elemento) => ({
    value: elemento.nombre,
    label: `${elemento.nombre} (Cantidad asignada: ${elemento.cantidad})`,
    cantidadAsignada: elemento.cantidad,
  }));

  const componenteOptions = componentesAsignados.map((componente) => ({
    value: componente.serialComponente,
    label: `${componente.nombreComponente} (Serial: ${componente.serialComponente})`,
  }));

  const handleElementosChange = (selectedOptions) => {
    setSelectedElementos(selectedOptions || []);
  };

  const handleTareaRealizadaChange = (e) => {
    setTareaRealizada(e.target.value);
  };

  const handleCantidadSobranteChange = (nombreElemento, cantidadSobrante) => {
    setElementoOrdenSobrantes((prev) => {
      const index = prev.findIndex((e) => e.nombre === nombreElemento);
      const updated = [...prev];
      if (index !== -1) {
        updated[index].cantidadSobrante = cantidadSobrante;
      } else {
        updated.push({ nombre: nombreElemento, cantidadSobrante });
      }
      return updated;
    });
  };

  const handleComponentesChange = (selectedOptions) => {
    const nuevosComponentesSobrantes = selectedOptions.map((componente) => ({
      marcaComponente: "",
      serialComponente: componente.value,
      nombreComponente: componente.label.split(" ")[0],
    }));
    setComponentesSobrantes(nuevosComponentesSobrantes);
  };

  const handleFechaCumplimientoChange = (e) => {
    setFechaCumplimiento(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      elementoOrden,
      elementoOrdenSobrantes,
      tareaRealizada,
      estadoOrden: "Orden finalizada",
      componentesAsignados,
      componentesSobrantes,
      fechaCumplimiento,
    };

    try {
      const response = await axios.put(
        `http://localhost:4000/api/ordenes/${item._id}/sobrantes`,
        data
      );
      console.log("Orden actualizada:", response.data);
    } catch (error) {
      console.error(
        "Error al actualizar la orden:",
        error.response ? error.response.data : error.message
      );
    }

    onClose();
  };

  if (!item) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-1/2"
        style={{ maxHeight: "80vh", overflowY: "auto" }} // Limitar altura y permitir scroll
      >
        <h3 className="text-lg font-bold mb-4">
          Seleccionar Elementos y Componentes en Retorno
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 mt-5">
            <div className="mb-4">
              <label
                htmlFor="elementos"
                className="block text-sm font-medium text-gray-700"
              >
                Elementos Asignados:
              </label>
              <Select
                id="elementos"
                value={selectedElementos}
                onChange={handleElementosChange}
                options={elementoOptions}
                isMulti
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Selecciona los Elementos en Retorno"
              />
            </div>
            {selectedElementos.map((elemento) => (
              <div key={elemento.value} className="mb-4">
                <label
                  htmlFor={`cantidad-${elemento.value}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  {`Elemento: ${elemento.label}`}
                </label>
                <input
                  type="number"
                  id={`cantidad-${elemento.value}`}
                  min="0"
                  max={elemento.cantidadAsignada}
                  onChange={(e) =>
                    handleCantidadSobranteChange(elemento.value, e.target.value)
                  }
                  className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                  placeholder={`Cantidad en retorno (Máximo ${elemento.cantidadAsignada})`}
                />
              </div>
            ))}

            <div className="mb-4">
              <label
                htmlFor="componentes"
                className="block text-sm font-medium text-gray-700"
              >
                Componentes Asignados:
              </label>
              <Select
                id="componentes"
                options={componenteOptions}
                isMulti
                onChange={handleComponentesChange}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Selecciona los Componentes en Retorno"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="tareaRealizada"
                className="block text-sm font-medium text-gray-700"
              >
                Actividad Realizada:
              </label>
              <input
                type="text"
                id="tareaRealizada"
                value={tareaRealizada}
                onChange={handleTareaRealizadaChange}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline mb-7"
                placeholder="Describe la actividad realizada"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="fechaCumplimiento"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de Cumplimiento de Orden:
              </label>
              <input
                type="date"
                id="fechaCumplimiento"
                value={fechaCumplimiento}
                onChange={handleFechaCumplimientoChange}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSobrantes;
