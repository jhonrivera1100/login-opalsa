import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { updateElementosRequest } from "../api/elementos";
import { getCasinosRequest } from "../api/casinos";

const TransferModal = ({ onClose, elemento }) => {
  const [selectedCasino, setSelectedCasino] = useState("");
  const [casinos, setCasinos] = useState([]); // Almacena todos los casinos para búsquedas internas
  const [casinosForSelect, setCasinosForSelect] = useState([]); // Almacena casinos para el selector, excluyendo el actual

  useEffect(() => {
    fetchCasinos();
  }, [elemento]); // Agregar elemento como dependencia para recargar cuando cambie

  const fetchCasinos = async () => {
    if (!elemento) {
      console.error("Elemento no está definido");
      return;
    }
    try {
      const response = await getCasinosRequest();
      setCasinos(response.data); // Almacenar todos los casinos
      const filteredCasinos = response.data.filter(
        (casino) => casino._id !== elemento.ubicacionDeElemento
      );
      setCasinosForSelect(filteredCasinos); // Configurar los casinos para el selector
    } catch (error) {
      console.error("Error fetching casinos:", error);
    }
  };

  const handleTransfer = async () => {
    console.log("Ubicación actual del elemento:", elemento.ubicacionDeElemento);
    console.log("Casino seleccionado para la transferencia:", selectedCasino);
  
    try {
      // Prepara el objeto de movimiento con los datos correctos
      const movimientoElm = {
        elementoId: elemento._id,
        oldUbicacionNombre: casinos.find(c => c._id === elemento.ubicacionDeElemento)?.nombreCasino || "",
        newUbicacionNombre: casinos.find(c => c._id === selectedCasino)?.nombreCasino || "",
        nombreElemento: elemento.nombreElemento,
        codigoElemento: elemento.codigoElemento,
      };
  
      console.log("Datos del movimiento enviados al backend:", movimientoElm);

      const updatedElemento = { ...elemento, ubicacionDeElemento: selectedCasino };

      // Envía la solicitud de actualización al backend
    await updateElementosRequest(updatedElemento);
    console.log("Elemento transferido a:", selectedCasino);


      // Envía la solicitud al backend
      await axios.post("/movimientos-elementos", movimientoElm);
      console.log("Historial de movimientos guardado");
  
      if (typeof onClose === 'function') {
        onClose(); // Cierra el modal
      }
  
      window.location.reload(); // Recarga la página para ver los cambios
    } catch (error) {
      console.error("Error al transferir el elemento:", error);
    }
  };
  
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative bg-white shadow-xl rounded-lg p-6">
        <button
          className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Transferir Elemento a otro casino
        </h2>

        <div className="flex items-center mb-4">
          <label className="mr-2">Seleccionar casino:</label>
          <select
            value={selectedCasino}
            onChange={(e) => setSelectedCasino(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="">Seleccionar...</option>
            {casinosForSelect.map((casino) => (
              <option key={casino._id} value={casino._id}>
                {casino.nombreCasino}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleTransfer}
            disabled={!selectedCasino}
            className={`bg-green-500 text-white px-3 py-1 rounded ${
              !selectedCasino && "opacity-50 cursor-not-allowed"
            }`}
          >
            Transferir
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferModal;
