import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getMaquinasRequest,
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
    try {
      const res = await getMaquinasRequest();
      setMaquinas(res.data);
    } catch (error) {
      console.error("Error al cargar las máquinas:", error);
    }
  };

  const createMaquina = async (maquinaData) => {
    try {
      const res = await createMaquinasRequest(maquinaData);
      setMaquinas([...maquinas, res.data]);
    } catch (error) {
      console.error("Error al crear una máquina:", error);
    }
  };

  const updateMaquina = async (id, maquinaData) => {
    try {
      const res = await updateMaquinasRequest(id, maquinaData);
      const updatedMaquinas = maquinas.map((maquina) =>
        maquina._id === id ? res.data : maquina
      );
      setMaquinas(updatedMaquinas);
    } catch (error) {
      console.error("Error al actualizar la máquina:", error);
    }
  };

  const deleteMaquina = async (id) => {
    try {
      await deleteMaquinasRequest(id);
      setMaquinas(maquinas.filter((maquina) => maquina._id !== id));
    } catch (error) {
      console.error("Error al eliminar la máquina:", error);
    }
  };

  useEffect(() => {
    loadMaquinas();
  }, []);

  return (
    <MaquinaContext.Provider
      value={{
        maquinas,
        createMaquina,
        updateMaquina, // Función para actualizar la máquina
        deleteMaquina
      }}
    >
      {children}
    </MaquinaContext.Provider>
  );
}
