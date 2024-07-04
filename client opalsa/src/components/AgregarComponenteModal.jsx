import React, { useState } from "react";
import { useComponentes } from "../context/ComponentesContext";

function AgregarComponenteModal({ maquinaId, onClose }) {
  const { createComponente } = useComponentes();

  const [formData, setFormData] = useState({
    serialComponente: "",
    nombreComponente: "",
    marcaComponente: "",
    documentoComponente: null, // Inicialmente null para el archivo
    maquina: maquinaId,
  });

  const handleChange = (e) => {
    if (e.target.name === "documentoComponente") {
      setFormData({
        ...formData,
        documentoComponente: e.target.files[0], // Guardar el archivo seleccionado
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("serialComponente", formData.serialComponente);
    formDataToSend.append("nombreComponente", formData.nombreComponente);
    formDataToSend.append("marcaComponente", formData.marcaComponente);
    formDataToSend.append("maquina", formData.maquina);
    formDataToSend.append("documentoComponente", formData.documentoComponente); // Agregar el archivo al FormData

    await createComponente(formDataToSend);
    setFormData({
      serialComponente: "",
      nombreComponente: "",
      marcaComponente: "",
      documentoComponente: null, // Reiniciar el archivo después de enviar
      maquina: maquinaId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-auto">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4 text-black">Agregar Componente</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serialComponente">Serial del Componente</label>
            <input type="text" name="serialComponente" id="serialComponente" value={formData.serialComponente} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreComponente">Nombre del Componente</label>
            <input type="text" name="nombreComponente" id="nombreComponente" value={formData.nombreComponente} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marcaComponente">Marca del Componente</label>
            <input type="text" name="marcaComponente" id="marcaComponente" value={formData.marcaComponente} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentoComponente">Documento del Componente</label>
            <input type="file" name="documentoComponente" id="documentoComponente" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Cancelar</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Agregar Componente</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgregarComponenteModal;
