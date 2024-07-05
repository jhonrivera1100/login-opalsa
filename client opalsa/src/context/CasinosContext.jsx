// context/CasinosContext.js
import React, { createContext, useContext, useState } from "react";
import { createCasinoRequest } from "../api/casinos";

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

  const createCasino = async (casinoData) => {
    try {
      const res = await createCasinoRequest(casinoData);
      console.log("Casino creado:", res.data);
      // Actualizar el estado local o cualquier acción adicional
    } catch (error) {
      console.error("Error al crear el casino:", error);
      throw error;
    }
  };

  return (
    <CasinosContext.Provider
      value={{
        casinos,
        createCasino,
      }}
    >
      {children}
    </CasinosContext.Provider>
  );
}
