import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "../api/axios";
import { updateMaquinasRequest } from "../api/maquinas";
import { getCasinosRequest } from "../api/casinos";

function TransferirMaquinaModal({ maquina, onClose }) {
  const [selectedCasino, setSelectedCasino] = useState(""); // Estado para el casino seleccionado
  const [casinos, setCasinos] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para el spinner de carga
  const [transferSuccess, setTransferSuccess] = useState(false); // Estado para el mensaje de éxito

  // Cargar los casinos disponibles cuando el componente se monta
  useEffect(() => {
    fetchCasinos();
  }, []);

  // Función para obtener los casinos y filtrar el casino actual de la máquina
  const fetchCasinos = async () => {
    try {
      const response = await getCasinosRequest();
      // Filtrar los casinos para excluir el casino actual de la máquina
      const filteredCasinos = response.data.filter(
        (casino) => casino.nombreCasino !== maquina.ubicacionMaquina
      );
      setCasinos(filteredCasinos);
    } catch (error) {
      console.error("Error fetching casinos:", error);
    }
  };

  // Función para manejar la transferencia de la máquina
  const handleTransferir = async () => {
    setLoading(true); // Mostrar el spinner de carga
    setTransferSuccess(false); // Resetear mensaje de éxito

    try {
      // Actualiza la ubicación de la máquina en el backend
      const updatedMaquina = { ...maquina, ubicacionMaquina: selectedCasino };
      await updateMaquinasRequest(maquina._id, updatedMaquina); // Asegúrate de pasar el ID correctamente
      console.log("Máquina transferida a:", selectedCasino);

      // Datos del movimiento que serán guardados en el historial
      const movimiento = {
        maquinaId: maquina._id,
        oldCasinoId: maquina.ubicacionMaquina,
        oldCasinoNombre: maquina.ubicacionMaquina,
        newCasinoId: selectedCasino,
        newCasinoNombre: selectedCasino,
        marcaMaquina: maquina.marcaMaquina,
        serialMaquina: maquina.nroSerieMaquina,
      };

      console.log("Datos del movimiento de máquina:", movimiento);

      // Registro en el historial de movimientos
      await axios.post("/moviMaquinas", movimiento);
      console.log("Historial de movimientos guardado");

      setLoading(false); // Ocultar el spinner de carga
      setTransferSuccess(true); // Mostrar el mensaje de éxito
    } catch (error) {
      setLoading(false); // Ocultar el spinner si hay un error
      console.error("Error al transferir la máquina:", error);
    }
  };

  // Función para manejar el botón de regresar y recargar la página
  const handleRegresar = () => {
    window.location.reload(); // Recargar la página
  };

  // Opciones para el componente Select (React-Select)
  const options = casinos.map((casino) => ({
    value: casino.nombreCasino,
    label: casino.nombreCasino,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white shadow-2xl rounded-lg p-8 w-[400px] transform transition-all ease-out duration-300 scale-100 hover:scale-105">
        {/* Mostrar el botón de cerrar solo si la transferencia no ha sido exitosa */}
        {!transferSuccess && (
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
        )}

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Transferir Máquina
        </h2>

        {/* Mostrar el spinner de carga o el contenido del modal */}
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
          // Mostrar el mensaje de éxito si la transferencia fue exitosa
          <>
            <div className="text-center text-green-500 font-semibold mb-6">
              ¡Máquina transferida exitosamente a {selectedCasino}!
            </div>
            <button
              onClick={handleRegresar}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition duration-200 text-white rounded-lg font-semibold"
            >
              Regresar
            </button>
          </>
        ) : (
          // Mostrar el contenido normal del modal
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Casino:
              </label>
              <Select
                value={options.find((option) => option.value === selectedCasino)}
                onChange={(selectedOption) =>
                  setSelectedCasino(selectedOption.value)
                }
                options={options}
                placeholder="Seleccionar Casino..."
                isSearchable={true} // Habilita la búsqueda
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleTransferir}
                disabled={!selectedCasino}
                className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                  selectedCasino
                    ? "bg-blue-600 hover:bg-blue-700 transition duration-200"
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
}

export default TransferirMaquinaModal;
