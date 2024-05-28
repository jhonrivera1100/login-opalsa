import React, { useState, useEffect } from "react";
import { useMaquinas } from "../context/MaquinasContext";
import { useComponentes } from "../context/ComponentesContext";

function TransferirComponenteModal({ onClose }) {
  const { maquinas } = useMaquinas();
  const { componentes } = useComponentes();
  const [numerosDeSerie, setNumerosDeSerie] = useState([]);
  const [formData, setFormData] = useState({
    serialComponente: "",
    nuevaMaquinaSerial: "" 
  });

  useEffect(() => {
    // Extraer los números de serie de las máquinas disponibles
    const numerosDeSerie = maquinas.map((maquina) => maquina.nroSerieMaquina);
    setNumerosDeSerie(numerosDeSerie);
  }, [maquinas]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí va la lógica para transferir el componente
    console.log("Componente a transferir:", formData.serialComponente);
    console.log("Nueva máquina:", formData.nuevaMaquinaSerial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-auto">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4 text-black">Transferir Componente</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serialComponente">Serial del Componente</label>
            <input type="text" name="serialComponente" id="serialComponente" value={formData.serialComponente} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nuevaMaquinaSerial">Seleccionar Maquina</label>
            <select name="nuevaMaquinaSerial" id="nuevaMaquinaSerial" value={formData.nuevaMaquinaSerial} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required >
              <option value="">Seleccione una máquina</option>
              {numerosDeSerie.map((serial, index) => (
                <option key={index} value={serial}>{serial}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Transferir Componente</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransferirComponenteModal;
