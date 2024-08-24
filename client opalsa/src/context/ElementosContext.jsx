import React, { createContext, useContext, useState } from "react";
import {
  getElementosRequest,
  getElementoRequest,
  createElementosRequest,
  updateElementosRequest,
  deleteElementosRequest,
  getElementosByCasinoRequest, // nueva función para obtener elementos por casino
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

  const updateElemento = async (elementoData) => {
    try {
      const res = await updateElementosRequest(elementoData);
      setElementos(
        elementos.map((elemento) =>
          elemento._id === res.data._id ? res.data : elemento
        )
      );
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
        updateElemento,
        deleteElemento,
      }}
    >
      {children}
    </ElementosContext.Provider>
  );
}
