import React, { createContext, useContext, useState } from "react";
import {
  createComponentesRequest,
  deleteComponentesRequest,
  getComponentesRequest,
  updateComponentesRequest,
  getComponenteBySerialRequest,
} from "../api/componentes.js";

const ComponentesContext = createContext();

export const useComponentes = () => {
  const context = useContext(ComponentesContext);
  if (!context) {
    throw new Error("useComponentes debe estar dentro de un provider");
  }
  return context;
};

export function ComponentesProvider({ children }) {
  const [componentes, setComponentes] = useState([]);
  const [pagination, setPagination] = useState({
    totalComponentes: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  // Obtener componentes con paginación y filtrado por máquina
  const getComponentes = async (maquinaId, page = 1, limit = 6) => {
    setLoading(true); // Establecer estado de carga
    try {
      const response = await getComponentesRequest(maquinaId, page, limit);
      setComponentes(response.data.componentes);

      // Actualizar la paginación
      setPagination({
        totalComponentes: response.data.totalComponentes,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      console.error("Error al obtener componentes:", error);
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };

  const getComponenteBySerial = async (serial) => {
    setLoading(true); 
    try {
      const response = await getComponenteBySerialRequest(serial);
      return response.data; // Devuelve el componente directamente en lugar de actualizar el estado de componentes
    } catch (error) {
      console.error("Error al obtener componente por serial:", error);
      return null; // En caso de error o si no se encuentra, devolver null
    } finally {
      setLoading(false);
    }
  };
  
  

  const createComponente = async (componenteData) => {
    try {
      const response = await createComponentesRequest(componenteData);
      console.log("Componente creado:", response.data);
      // Después de crear un nuevo componente, se recarga la lista de componentes
      getComponentes(response.data.maquina);
    } catch (error) {
      console.error("Error al crear componente:", error);
    }
  };

  const updateComponente = async (componenteData) => {
    try {
      const response = await updateComponentesRequest(componenteData);
      console.log("Componente actualizado:", response.data);
      // Después de actualizar un componente, se recarga la lista de componentes
      getComponentes(response.data.maquina, pagination.currentPage);
    } catch (error) {
      console.error("Error al actualizar componente:", error);
    }
  };

  const deleteComponente = async (id, maquinaId) => {
    try {
      const response = await deleteComponentesRequest(id);
      console.log("Componente eliminado:", response.data);
      // Después de eliminar un componente, se recarga la lista de componentes
      getComponentes(maquinaId, pagination.currentPage);
    } catch (error) {
      console.error("Error al eliminar componente:", error);
    }
  };

  return (
    <ComponentesContext.Provider
      value={{
        componentes,
        pagination, // Exponer el estado de la paginación
        loading, // Exponer el estado de carga
        getComponentes,
        createComponente,
        updateComponente,
        deleteComponente,
        getComponenteBySerial,
      }}
    >
      {children}
    </ComponentesContext.Provider>
  );
}
