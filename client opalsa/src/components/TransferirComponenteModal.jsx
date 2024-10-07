import axios from "../api/axios";
import React, { useState, useEffect } from "react";
import { getMaquinasRequest } from "../api/maquinas";
import { useMaquinas } from '../context/MaquinasContext'; // Usamos el contexto

function TransferirComponenteModal({ maquina, componentes, onClose, onComponentTransferred = () => {} }) {
  const { buscarMaquinaPorSerie } = useMaquinas(); // Usamos la búsqueda de máquina por número de serie
  const [numerosDeSerie, setNumerosDeSerie] = useState([]);
  const [nombreComponente, setNombreComponente] = useState("");
  const [formData, setFormData] = useState({
    serialComponente: "",
    nuevaMaquinaSerial: "",
  });
  const [nuevaMaquina, setNuevaMaquina] = useState(null); // Estado para almacenar la máquina encontrada
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!maquina) return;

    // Filtra números de serie para componentes de la máquina actual
    const numerosDeSerieFiltrados = componentes
      .filter((componente) => componente.maquina === maquina._id)
      .map((componente) => componente.serialComponente);

    setNumerosDeSerie(numerosDeSerieFiltrados);
  }, [maquina, componentes]);

  // Manejar el cambio en el número de serie de la nueva máquina
  const handleNuevaMaquinaSerialChange = async (e) => {
    const selectedSerie = e.target.value.trim();
    setFormData({ ...formData, nuevaMaquinaSerial: selectedSerie });
    
    if (selectedSerie) {
      setIsSearching(true);

      try {
        const maquinaEncontrada = await buscarMaquinaPorSerie(selectedSerie);
        
        if (maquinaEncontrada) {
          setNuevaMaquina(maquinaEncontrada);
          setError(null); // Limpiar el error si se encuentra la máquina
        } else {
          setNuevaMaquina(null);
          setError(`No se encontró la máquina con número de serie: ${selectedSerie}`);
        }
      } catch (err) {
        console.error('Error al buscar la máquina:', err);
        setError('Error al buscar la máquina. Inténtalo de nuevo.');
      } finally {
        setIsSearching(false);
      }
    } else {
      setNuevaMaquina(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevaMaquina) {
      setError('Debe seleccionar una máquina válida para transferir el componente.');
      return;
    }

    try {
      const componenteAActualizar = componentes.find(
        (componente) => componente.serialComponente === formData.serialComponente
      );

      await axios.put(`/componentes/${componenteAActualizar._id}`, {
        maquina: nuevaMaquina._id,
      });

      console.log("Componente transferido exitosamente:", formData.serialComponente);
      console.log("Nueva máquina:", nuevaMaquina.nroSerieMaquina);

      // Registro en el historial
      await axios.post("/movimientos", {
        componenteId: componenteAActualizar._id,
        oldMaquinaId: maquina._id,
        oldMaquinaSerial: maquina.nroSerieMaquina, // Número de serie de la máquina anterior
        newMaquinaId: nuevaMaquina._id,
        newMaquinaSerial: nuevaMaquina.nroSerieMaquina, // Número de serie de la nueva máquina
        nombreComponente: componenteAActualizar.nombreComponente,
        serialComponente: componenteAActualizar.serialComponente,
      });

      console.log("Historial de movimientos guardado");

      onComponentTransferred(); // Notificar que la transferencia fue exitosa
    } catch (error) {
      console.error("Error al transferir el componente:", error);
      setError('Error al transferir el componente.');
    }

    onClose();
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 overflow-auto">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4 text-black">Transferir Componente</h3>
        {isSearching && <p>Buscando la máquina...</p>}
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
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nuevaMaquinaSerial"
            >
              Número de Serie de la Nueva Máquina
            </label>
            <input
              type="text"
              name="nuevaMaquinaSerial"
              id="nuevaMaquinaSerial"
              value={formData.nuevaMaquinaSerial}
              onChange={handleNuevaMaquinaSerialChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                nuevaMaquina ? "bg-green-200 border-green-500" : "bg-gray-100"
              }`}
              required
              placeholder="Ingrese el número de serie de la nueva máquina"
            />
            {nuevaMaquina && (
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600 font-bold text-xl">
                ✔
              </span>
            )}
          </div>
          {nuevaMaquina && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nueva Máquina Encontrada
              </label>
              <p className="text-gray-700 font-bold">MARCA: {nuevaMaquina.marcaMaquina} - UBICACION: {nuevaMaquina.ubicacionMaquina}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
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
              disabled={isSearching || !nuevaMaquina} // Deshabilitar si aún se está buscando la máquina o no se ha encontrado
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
