import axios from "../api/axios";
import React, { useState, useEffect } from "react";
import { getMaquinasRequest } from "../api/maquinas";

function TransferirComponenteModal({ maquina, componentes, onClose, onComponentTransferred = () => {} }) {
  const [numerosDeSerie, setNumerosDeSerie] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [nombreComponente, setNombreComponente] = useState("");
  const [formData, setFormData] = useState({
    serialComponente: "",
    nuevaMaquinaSerial: "",
  });

  useEffect(() => {
    if (!maquina) return;

    // Filtra números de serie para componentes de la máquina actual
    const numerosDeSerieFiltrados = componentes
      .filter((componente) => componente.maquina === maquina._id)
      .map((componente) => componente.serialComponente);

    setNumerosDeSerie(numerosDeSerieFiltrados);
  }, [maquina, componentes]);

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const response = await getMaquinasRequest();
        // Excluir la máquina actual del listado de máquinas
        const maquinasFiltradas = response.data.filter(
          (m) => m._id !== maquina._id
        );
        setMaquinas(maquinasFiltradas);
      } catch (error) {
        console.error("Error al obtener las máquinas:", error);
      }
    };

    fetchMaquinas();
  }, [maquina]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "serialComponente") {
      const selectedComponent = componentes.find(
        (componente) => componente.serialComponente === value
      );
      setNombreComponente(selectedComponent ? selectedComponent.nombreComponente : "");
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const componenteAActualizar = componentes.find(
        (componente) => componente.serialComponente === formData.serialComponente
      );

      await axios.put(`/componentes/${componenteAActualizar._id}`, {
        maquina: formData.nuevaMaquinaSerial,
      });

      console.log("Componente transferido exitosamente:", formData.serialComponente);
      console.log("Nueva máquina:", formData.nuevaMaquinaSerial);

      // Registro en el historial
      await axios.post("/movimientos", {
        componenteId: componenteAActualizar._id,
        oldMaquinaId: maquina._id,
        oldMaquinaSerial: maquina.nroSerieMaquina, // Asegúrate de tener el número de serie de la máquina anterior
        newMaquinaId: formData.nuevaMaquinaSerial,
        newMaquinaSerial: maquinas.find(m => m._id === formData.nuevaMaquinaSerial).nroSerieMaquina, // Obtener el número de serie de la nueva máquina
        nombreComponente: componenteAActualizar.nombreComponente,
        serialComponente: componenteAActualizar.serialComponente,
      });

      console.log("Historial de movimientos guardado");

      // Llama al callback para notificar que la transferencia fue exitosa
      onComponentTransferred();
    } catch (error) {
      console.error("Error al transferir el componente:", error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-auto">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4 text-black">Transferir Componente</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="serialComponente"
            >
              Serial del Componente
            </label>
            <select
              name="serialComponente"
              id="serialComponente"
              value={formData.serialComponente}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Seleccione un número de serie</option>
              {numerosDeSerie.map((serial, index) => (
                <option key={index} value={serial}>
                  {serial}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del Componente
            </label>
            <input
              type="text"
              value={nombreComponente}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nuevaMaquinaSerial"
            >
              Seleccionar Máquina
            </label>
            <select
              name="nuevaMaquinaSerial"
              id="nuevaMaquinaSerial"
              value={formData.nuevaMaquinaSerial}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-black"
              required
            >
              <option value="">Seleccione una máquina</option>
              {maquinas.map((maquina) => (
                <option key={maquina._id} value={maquina._id}>
                  {maquina.nroSerieMaquina}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Transferir Componente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferirComponenteModal;
