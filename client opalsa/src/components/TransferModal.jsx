import React, { useEffect, useState } from "react";
import Select from "react-select"; // Importa react-select
import axios from "../api/axios";
import { updateElementosRequest } from "../api/elementos";
import { getCasinosRequest } from "../api/casinos";

const TransferModal = ({ onClose, elemento }) => {
  const [selectedCasino, setSelectedCasino] = useState("");
  const [casinos, setCasinos] = useState([]); // Almacena todos los casinos para búsquedas internas
  const [casinosForSelect, setCasinosForSelect] = useState([]); // Almacena casinos para el selector, excluyendo el actual
  const [loading, setLoading] = useState(false); // Estado para el spinner de carga
  const [transferSuccess, setTransferSuccess] = useState(false); // Estado para el mensaje de éxito

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

    setLoading(true); // Mostrar el spinner de carga
    setTransferSuccess(false); // Resetear el estado de éxito

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

      setTransferSuccess(true); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al transferir el elemento:", error);
    } finally {
      setLoading(false); // Ocultar el spinner de carga
    }
  };

  // Mapea las opciones para el select de react-select
  const options = casinosForSelect.map((casino) => ({
    value: casino._id,
    label: casino.nombreCasino,
  }));

  // Función para manejar el botón de regresar y recargar la página
  const handleRegresar = () => {
    window.location.reload(); // Recargar la página
  };

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

        {loading ? (
          <div className="relative flex justify-center items-center w-12 h-12 mx-auto mb-6">
            <div className="absolute animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <img
              src="https://res.cloudinary.com/dtqiwgbbp/image/upload/v1727359701/vjg0klgqxuqfiesshgdb.jpg"
              className="rounded-full h-10 w-10 object-cover"
              alt="Loader"
            />
          </div>
        ) : transferSuccess ? (
          <>
            <div className="text-center text-green-500 font-semibold mb-6">
              ¡Elemento transferido exitosamente!
            </div>
            <button
              onClick={handleRegresar}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition duration-200 text-white rounded-lg font-semibold"
            >
              Regresar
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default TransferModal;
