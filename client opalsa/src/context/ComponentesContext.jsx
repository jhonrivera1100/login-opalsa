import React, { createContext, useContext, useState } from "react";
import {
  createComponentesRequest,
  deleteComponentesRequest,
  getComponentesRequest,
  updateComponentesRequest,
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

  const getComponentes = async () => {
    try {
      const response = await getComponentesRequest();
      setComponentes(response.data);
    } catch (error) {
      console.error("Error al obtener componentes:", error);
    }
  };

  const createComponente = async (componenteData) => {
    try {
      const response = await createComponentesRequest(componenteData);
      console.log("Componente creado:", response.data);
      // Actualizar la lista de componentes después de crear uno nuevo
      getComponentes();
    } catch (error) {
      console.error("Error al crear componente:", error);
    }
  };

  const updateComponente = async (componenteData) => {
    try {
      const response = await updateComponentesRequest(componenteData);
      console.log("Componente actualizado:", response.data);
      // Actualizar la lista de componentes después de actualizar uno existente
      getComponentes();
    } catch (error) {
      console.error("Error al actualizar componente:", error);
    }
  };

  const deleteComponente = async (id) => {
    try {
      const response = await deleteComponentesRequest(id);
      console.log("Componente eliminado:", response.data);
      // Actualizar la lista de componentes después de eliminar uno
      getComponentes();
    } catch (error) {
      console.error("Error al eliminar componente:", error);
    }
  };

  return (
    <ComponentesContext.Provider
      value={{
        componentes,
        getComponentes,
        createComponente,
        updateComponente,
        deleteComponente,
      }}
    >
      {children}
    </ComponentesContext.Provider>
  );
}
