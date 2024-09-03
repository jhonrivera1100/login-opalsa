import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getMaquinasRequest,
  getMaquinaRequest,
  createMaquinasRequest,
  updateMaquinasRequest,
  deleteMaquinasRequest
} from "../api/maquinas.js";

const MaquinaContext = createContext();

export const useMaquinas = () => {
  const context = useContext(MaquinaContext);
  if (!context) {
    throw new Error("useMaquinas debe estar dentro de un provider");
  }
  return context;
};

export function MaquinasProvider({ children }) {
  const [maquinas, setMaquinas] = useState([]);

  const loadMaquinas = async () => {
    const res = await getMaquinasRequest();
    setMaquinas(res.data);
  };

  const createMaquina = async (maquinaData) => {
    const res = await createMaquinasRequest(maquinaData);
    setMaquinas([...maquinas, res.data]);
  };

  const deleteMaquina = async (id) => {
    await deleteMaquinasRequest(id);
    setMaquinas(maquinas.filter((maquina) => maquina._id !== id));
  };

  useEffect(() => {
    loadMaquinas();
  }, []);

  return (
    <MaquinaContext.Provider
      value={{
        maquinas,
        createMaquina,
        deleteMaquina, // Añadido en el contexto
      }}
    >
      {children}
    </MaquinaContext.Provider>
  );
}
