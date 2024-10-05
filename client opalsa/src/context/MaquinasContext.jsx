import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getMaquinasRequest,
  createMaquinasRequest,
  updateMaquinasRequest,
  deleteMaquinasRequest,
  getMaquinasByCasinoRequest,
  getAllMaquinasRequest,
  buscarMaquinaPorNumeroDeSerieRequest,
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
  const [maquinas, setMaquinas] = useState([]); // Almacena las máquinas
  const [noMaquinas, setNoMaquinas] = useState(false); // Bandera para indicar si no hay máquinas
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación
  const [totalPages, setTotalPages] = useState(1); // Total de páginas de máquinas para la paginación

  // Cargar máquinas de forma paginada
  const loadMaquinas = useCallback(async (page = 1) => {
    try {
      const res = await getMaquinasRequest(page); // Petición para cargar máquinas con paginación
      setMaquinas(res.data.maquinas); // Guardar las máquinas recibidas
      setTotalPages(res.data.totalPages); // Establecer el total de páginas
      setCurrentPage(res.data.currentPage); // Establecer la página actual
    } catch (error) {
      console.error("Error al cargar las máquinas:", error);
    }
  }, []);

  // Cargar todas las máquinas con campos limitados (solución híbrida)
  const loadAllMaquinas = useCallback(async () => {
    try {
      const res = await getAllMaquinasRequest(); // Petición para cargar todas las máquinas con campos específicos
      setMaquinas(res.data); // Guardar las máquinas con campos limitados
    } catch (error) {
      console.error("Error al cargar todas las máquinas:", error);
    }
  }, []);

  // Buscar máquina por número de serie (cuando no se encuentra localmente)
  const buscarMaquinaPorSerie = useCallback(async (nroSerieMaquina) => {
    try {
      const res = await buscarMaquinaPorNumeroDeSerieRequest(nroSerieMaquina); // Petición para buscar máquina por número de serie
      return res.data; // Retornar la máquina encontrada
    } catch (error) {
      console.error("Error al buscar la máquina por número de serie:", error);
      return null; // Retornar null si ocurre un error
    }
  }, []);

  // Crear una nueva máquina
  const createMaquina = async (maquinaData) => {
    try {
      const res = await createMaquinasRequest(maquinaData); // Petición para crear una nueva máquina
      setMaquinas([...maquinas, res.data]); // Agregar la nueva máquina a la lista
    } catch (error) {
      console.error("Error al crear una máquina:", error);
    }
  };

  // Cargar máquinas filtradas por casino
  const loadMaquinasByCasino = useCallback(async (nombreCasino) => {
    try {
      const res = await getMaquinasByCasinoRequest(nombreCasino); // Petición para cargar máquinas por casino
      if (res.data.message === "No se encontraron máquinas para este casino") {
        setMaquinas([]); // No se encontraron máquinas
        setNoMaquinas(true);
      } else {
        setMaquinas(res.data); // Guardar las máquinas del casino
        setNoMaquinas(false);
      }
    } catch (error) {
      console.error("Error al cargar las máquinas por casino:", error);
      setNoMaquinas(true);
    }
  }, []);

  // Actualizar una máquina
  const updateMaquina = async (id, maquinaData) => {
    try {
      const res = await updateMaquinasRequest(id, maquinaData); // Petición para actualizar una máquina
      const updatedMaquinas = maquinas.map((maquina) =>
        maquina._id === id ? res.data : maquina
      );
      setMaquinas(updatedMaquinas); // Actualizar la lista de máquinas
    } catch (error) {
      console.error("Error al actualizar la máquina:", error);
    }
  };

  // Eliminar una máquina
  const deleteMaquina = async (id) => {
    try {
      await deleteMaquinasRequest(id); // Petición para eliminar una máquina
      setMaquinas(maquinas.filter((maquina) => maquina._id !== id)); // Eliminar la máquina de la lista localmente
    } catch (error) {
      console.error("Error al eliminar la máquina:", error);
    }
  };

  return (
    <MaquinaContext.Provider
      value={{
        maquinas,
        noMaquinas,
        currentPage,
        totalPages,
        loadMaquinas, // Cargar máquinas de forma paginada
        loadAllMaquinas, // Cargar todas las máquinas con campos limitados (solución híbrida)
        buscarMaquinaPorSerie, // Buscar máquina por número de serie
        loadMaquinasByCasino, // Cargar máquinas por casino
        createMaquina, // Crear máquina
        updateMaquina, // Actualizar máquina
        deleteMaquina, // Eliminar máquina
        setCurrentPage, // Establecer la página actual para paginación
      }}
    >
      {children}
    </MaquinaContext.Provider>
  );
}
