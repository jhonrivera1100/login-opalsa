import React, { createContext, useContext, useState } from "react";
import {
  createCasinoRequest,
  updateCasinoRequest,
  deleteCasinoRequest, // Importamos la función para eliminar
} from "../api/casinos"; 

const CasinosContext = createContext();

export const useCasinos = () => {
  const context = useContext(CasinosContext);
  if (!context) {
    throw new Error("useCasinos debe estar dentro de un provider de Casinos");
  }
  return context;
};

export function CasinosProvider({ children }) {
  const [casinos, setCasinos] = useState([]);

  // Función para crear un nuevo casino
  const createCasino = async (casinoData) => {
    try {
      const res = await createCasinoRequest(casinoData);
      console.log("Casino creado:", res.data);
      setCasinos([...casinos, res.data]); // Actualizamos el estado local
    } catch (error) {
      console.error("Error al crear el casino:", error);
      throw error;
    }
  };

  // Función para actualizar un casino existente (incluyendo documentos)
  const updateCasino = async (casinoId, updatedData) => {
    try {
      const res = await updateCasinoRequest(casinoId, updatedData);
      console.log("Casino actualizado:", res.data);
      // Actualizamos el estado local si es necesario
      setCasinos((prevCasinos) =>
        prevCasinos.map((casino) =>
          casino._id === casinoId ? res.data : casino
        )
      );
    } catch (error) {
      console.error("Error al actualizar el casino:", error);
      throw error;
    }
  };

  // Función para eliminar un casino
  const deleteCasino = async (casinoId) => {
    try {
      await deleteCasinoRequest(casinoId);
      setCasinos((prevCasinos) =>
        prevCasinos.filter((casino) => casino._id !== casinoId)
      );
      console.log(`Casino con ID ${casinoId} eliminado.`);
    } catch (error) {
      console.error("Error al eliminar el casino:", error);
      throw error;
    }
  };

  return (
    <CasinosContext.Provider
      value={{
        casinos,
        createCasino,
        updateCasino,
        deleteCasino, // Hacemos disponible la función de eliminar
      }}
    >
      {children}
    </CasinosContext.Provider>
  );
}
