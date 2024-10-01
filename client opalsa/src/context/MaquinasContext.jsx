import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getMaquinasRequest,
  createMaquinasRequest,
  updateMaquinasRequest,
  deleteMaquinasRequest,
  getMaquinasByCasinoRequest,
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
  const [noMaquinas, setNoMaquinas] = useState(false); // Nuevo estado para manejar si no hay máquinas

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

  const loadMaquinasByCasino = useCallback(async (nombreCasino) => {
    try {
      const res = await getMaquinasByCasinoRequest(nombreCasino);
      if (res.data.message === "No se encontraron máquinas para este casino") {
        setMaquinas([]); // No mostrar máquinas
        setNoMaquinas(true); // Indicamos que no hay máquinas
      } else {
        setMaquinas(res.data); // Mostrar las máquinas recibidas
        setNoMaquinas(false); // Resetear el estado si hay máquinas
      }
    } catch (error) {
      console.error("Error al cargar las máquinas:", error);
      setNoMaquinas(true); // También manejar errores como "no hay máquinas"
    }
  }, []);

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
        noMaquinas, // Nuevo valor en el contexto
        loadMaquinasByCasino,
        createMaquina,
        updateMaquina,
        deleteMaquina,
      }}
    >
      {children}
    </MaquinaContext.Provider>
  );
}
