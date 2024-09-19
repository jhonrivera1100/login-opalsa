import React, { useEffect, useState } from "react";
import Select from "react-select"; // Importa react-select
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
      const movimientoElm = {
        elementoId: elemento._id,
        oldUbicacionNombre: casinos.find(c => c._id === elemento.ubicacionDeElemento)?.nombreCasino || "",
        newUbicacionNombre: casinos.find(c => c._id === selectedCasino)?.nombreCasino || "",
        nombreElemento: elemento.nombreElemento,
        codigoElemento: elemento.codigoElemento,
      };

      console.log("Datos del movimiento enviados al backend:", movimientoElm);

      const updatedElemento = { ...elemento, ubicacionDeElemento: selectedCasino };

      await updateElementosRequest(updatedElemento);
      console.log("Elemento transferido a:", selectedCasino);

      await axios.post("/movimientos-elementos", movimientoElm);
      console.log("Historial de movimientos guardado");

      if (typeof onClose === 'function') {
        onClose(); // Cierra el modal
      } else {
        console.error('onClose no es una función');
      }

      // Elimina o comenta esta línea si está causando problemas con el cierre del modal
      window.location.reload(); // Recarga la página para ver los cambios
    } catch (error) {
      console.error("Error al transferir el elemento:", error);
    }
  };

  // Mapea las opciones para el select de react-select
  const options = casinosForSelect.map((casino) => ({
    value: casino._id,
    label: casino.nombreCasino,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white shadow-2xl rounded-lg p-8 w-[400px] transform transition-all ease-out duration-300 scale-100 hover:scale-105">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-200"
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

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Transferir Elemento
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Casino:
          </label>
          <Select
            value={options.find((option) => option.value === selectedCasino)}
            onChange={(selectedOption) => setSelectedCasino(selectedOption.value)}
            options={options}
            placeholder="Seleccionar Casino..."
            isSearchable={true} // Habilita la búsqueda
            className="w-full"
            classNamePrefix="react-select"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleTransfer}
            disabled={!selectedCasino}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
              selectedCasino
                ? "bg-green-600 hover:bg-green-700 transition duration-200"
                : "bg-gray-300 cursor-not-allowed"
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
