import axios from "../api/axios";
import React, { useState, useEffect } from "react";
import { getMaquinasRequest } from "../api/maquinas";


function TransferirComponenteModal({ maquina, componentes, onClose }) {
  const [numerosDeSerie, setNumerosDeSerie] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [formData, setFormData] = useState({
    serialComponente: "",
    nuevaMaquinaSerial: "",
  });

  useEffect(() => {
    if (!maquina) return;

    const numerosDeSerieFiltrados = componentes
      .filter((componente) => componente.maquina === maquina._id)
      .map((componente) => componente.serialComponente);

    setNumerosDeSerie(numerosDeSerieFiltrados);
  }, [maquina, componentes]);

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        const response = await getMaquinasRequest();
        setMaquinas(response.data);
      } catch (error) {
        console.error("Error al obtener las máquinas:", error);
      }
    };

    fetchMaquinas();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const componenteAActualizar = componentes.find(
        (componente) => componente.serialComponente === formData.serialComponente
      );

      await axios.put(`/componentes/${componenteAActualizar._id}`, {
        maquina: formData.nuevaMaquinaSerial
      });

      console.log("Componente transferido exitosamente:", formData.serialComponente);
      console.log("Nueva máquina:", formData.nuevaMaquinaSerial);
    } catch (error) {
      console.error("Error al transferir el componente:", error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-auto">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4 text-black">
          Transferir Componente
        </h3>
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
