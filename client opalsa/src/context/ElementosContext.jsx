// context/ElementosContext.js
import React, { createContext, useContext, useState } from "react";
import {
  getElementosRequest,
  createElementosRequest,
  updateElementosRequest,
  deleteElementosRequest,
} from "../api/elementos";

const ElementosContext = createContext();

export const useElementos = () => {
  const context = useContext(ElementosContext);
  if (!context) {
    throw new Error("useElementos debe estar dentro de un provider de Elementos");
  }
  return context;
};

export function ElementosProvider({ children }) {
  const [elementos, setElementos] = useState([]);

  const getElementos = async () => {
    try {
      const res = await getElementosRequest();
      setElementos(res.data);
    } catch (error) {
      console.error("Error al obtener los elementos:", error);
      throw error;
    }
  };

  const createElemento = async (elementoData) => {
    try {
      const res = await createElementosRequest(elementoData);
      setElementos([...elementos, res.data]);
    } catch (error) {
      console.error("Error al crear el elemento:", error);
      throw error;
    }
  };

  const updateElemento = async (id, newData) => {
    try {
      const res = await updateElementosRequest(id, newData);
      setElementos(elementos.map((elemento) => 
        elemento._id === id ? res.data : elemento
      ));
    } catch (error) {
      console.error("Error al actualizar el elemento:", error);
      throw error;
    }
  };

  const deleteElemento = async (id) => {
    try {
      await deleteElementosRequest(id);
      setElementos(elementos.filter((elemento) => elemento._id !== id));
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
      throw error;
    }
  };

  return (
    <ElementosContext.Provider
      value={{
        elementos,
        getElementos,
        createElemento,
        updateElemento,
        deleteElemento,
      }}
    >
      {children}
    </ElementosContext.Provider>
  );
}
