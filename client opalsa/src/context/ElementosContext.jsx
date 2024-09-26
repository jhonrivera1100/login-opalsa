import React, { createContext, useContext, useState } from "react";
import {
  getElementosRequest,
  getElementoRequest,
  createElementosRequest,
  updateElementosRequest, // Asegúrate de que esto está correctamente importado
  deleteElementosRequest,
  getElementosByCasinoRequest,
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
    }
  };

  const getElementosByCasino = async (casinoId) => {
    try {
      const res = await getElementosByCasinoRequest(casinoId);
      setElementos(res.data);
    } catch (error) {
      console.error("Error al obtener los elementos del casino:", error);
    }
  };

  const createElemento = async (elementoData) => {
    try {
      const res = await createElementosRequest(elementoData);
      setElementos([...elementos, res.data]);
    } catch (error) {
      console.error("Error al crear el elemento:", error);
    }
  };

  const updateElemento = async (elemento) => {
    try {
      const res = await updateElementosRequest(elemento);
      setElementos(elementos.map(el => el._id === elemento._id ? res.data : el));
    } catch (error) {
      console.error("Error al actualizar el elemento:", error);
    }
  };

  const deleteElemento = async (id) => {
    try {
      await deleteElementosRequest(id);
      setElementos(elementos.filter((elemento) => elemento._id !== id));
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
    }
  };

  return (
    <ElementosContext.Provider
      value={{
        elementos,
        getElementos,
        getElementosByCasino,
        createElemento,
        updateElemento, // Asegúrate de exponer la función aquí
        deleteElemento,
      }}
    >
      {children}
    </ElementosContext.Provider>
  );
}
