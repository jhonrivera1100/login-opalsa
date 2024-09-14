import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { getCasinosRequest } from "../api/casinos"; // Asegúrate de que esta ruta sea correcta
import { useElementos } from "../context/ElementosContext"; // Asegúrate de que esta ruta sea correcta
import { cambiarUbicacionElementoRequest } from "../api/elementos";

const TransferModal = ({ isOpen, onRequestClose, elemento }) => {
  const [casinoDestino, setCasinoDestino] = useState("");
  const [casinos, setCasinos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cambiarUbicacionElemento } = useElementos(); // Usa el hook para acceder a la función del contexto

  useEffect(() => {
    if (isOpen) {
      const fetchCasinos = async () => {
        try {
          const response = await getCasinosRequest();
          setCasinos(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error al obtener los casinos:", error);
          setIsLoading(false);
        }
      };
      fetchCasinos();
    }
  }, [isOpen]);

  const handleTransfer = () => {
    if (casinoDestino) {
      cambiarUbicacionElementoRequest(elemento._id, casinoDestino); // Llama a la función del contexto
      setCasinoDestino("");
      onRequestClose();
    } else {
      alert("Selecciona un casino de destino");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Transferir Elemento"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="relative bg-white p-4 rounded-lg w-full max-w-md">
        <button
          onClick={onRequestClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl text-center text-slate-500 font-bold mb-4">
          Transferir Elemento
        </h2>
        <div className="w-full mb-4">
          <label className="block mb-2 text-sm text-gray-600">Casino de destino:</label>

          {isLoading ? (
            <p>Cargando casinos...</p>
          ) : (
            <select
              value={casinoDestino}
              onChange={(e) => setCasinoDestino(e.target.value)}
              className="w-full border-b-2 focus:outline-none focus:border-blue-600 p-2"
            >
              <option value="">Selecciona un casino</option>
              {casinos.map((casino) => (
                <option key={casino._id} value={casino._id}>
                  {casino.nombreCasino} {/* Asegúrate de que este sea el nombre del campo correcto */}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleTransfer}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Transferir
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferModal;
