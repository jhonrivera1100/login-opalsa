import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { getMaquinaRequest, updateMaquinasRequest } from "../api/maquinas";
import { getCasinosRequest } from "../api/casinos";

function TransferirMaquinaModal({ maquina, onClose }) {
  const [selectedCasino, setSelectedCasino] = useState(""); // Estado para el casino seleccionado
  const [casinos, setCasinos] = useState([]);

  useEffect(() => {
    fetchCasinos();
  }, []);

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
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  const handleTransferir = async () => {
    try {
      // Actualiza la ubicación de la máquina en el backend
      const updatedMaquina = { ...maquina, ubicacionMaquina: selectedCasino };
      await updateMaquinasRequest(updatedMaquina);
      console.log("Máquina transferida a:", selectedCasino);
  
      // Datos del movimiento
      const movimiento = {
        maquinaId: maquina._id,
        oldCasinoId: maquina.ubicacionMaquina,
        oldCasinoNombre: maquina.ubicacionMaquina,
        newCasinoId: selectedCasino,
        newCasinoNombre: selectedCasino,
        marcaMaquina: maquina.marcaMaquina,
        serialMaquina: maquina.nroSerieMaquina,
      };
  
      // Log del objeto del movimiento de máquina
      console.log("Datos del movimiento de máquina:", movimiento);
  
      // Registro en el historial
      await axios.post("/moviMaquinas", movimiento);
  
      console.log("Historial de movimientos guardado");
  
      onClose(); // Cerrar el modal después de transferir
      window.location.reload(); // Recargar la página
    } catch (error) {
      console.error("Error al transferir la máquina:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
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
          Transferir máquina a otro casino
        </h2>

        <div className="flex items-center mb-4">
          <label className="mr-2">Seleccionar casino:</label>
          <select
            value={selectedCasino}
            onChange={(e) => setSelectedCasino(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="">Seleccionar...</option>
            {casinos.map((casino) => (
              <option key={casino._id} value={casino.nombreCasino}>
                {casino.nombreCasino}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleTransferir}
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
}

export default TransferirMaquinaModal;
