import React, { createContext, useContext, useState } from "react";
import {
  createCasinoRequest,
  updateCasinoRequest,
  deleteCasinoRequest,
  deleteCasinoDocumentRequest,
  getCasinoRequest // Importamos la función para obtener un casino por ID
} from "../api/casinos";

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

  // Función para crear un nuevo casino
  const createCasino = async (casinoData) => {
    try {
      const res = await createCasinoRequest(casinoData);
      setCasinos([...casinos, res.data]); // Actualizamos el estado local
    } catch (error) {
      console.error("Error al crear el casino:", error);
      throw error;
    }
  };

  // Función para actualizar un casino existente (incluyendo documentos)
  const updateCasino = async (casinoId, updatedData) => {
    try {
      const res = await updateCasinoRequest(casinoId, updatedData);

      if (res.status === 200 && res.data) {
        // Actualizamos el estado local si la respuesta es exitosa
        setCasinos((prevCasinos) =>
          prevCasinos.map((casino) =>
            casino._id === casinoId ? res.data : casino
          )
        );
        return res; // Retornar la respuesta para manejar en el frontend
      } else {
        console.error("Error al actualizar el casino: Respuesta inesperada del servidor.");
        throw new Error("Error inesperado en la respuesta del servidor.");
      }
    } catch (error) {
      console.error("Error al actualizar el casino:", error);
      throw error;
    }
  };

  // Función para eliminar un casino
  const deleteCasino = async (casinoId) => {
    try {
      await deleteCasinoRequest(casinoId);
      setCasinos((prevCasinos) =>
        prevCasinos.filter((casino) => casino._id !== casinoId)
      );
      console.log(`Casino con ID ${casinoId} eliminado.`);
    } catch (error) {
      console.error("Error al eliminar el casino:", error);
      throw error;
    }
  };

  // Función para eliminar un documento específico del casino
  const deleteDocument = async (casinoId, publicId, category) => {
    try {
      await deleteCasinoDocumentRequest(casinoId, publicId, category); // Realizamos la solicitud al backend
      // Actualiza el estado local para reflejar el documento eliminado
      setCasinos((prevCasinos) =>
        prevCasinos.map((casino) => {
          if (casino._id === casinoId) {
            return {
              ...casino,
              [category]: casino[category].filter(
                (doc) => doc.public_id !== publicId
              ),
            };
          }
          return casino;
        })
      );
      console.log(`Documento con public_id ${publicId} eliminado del casino.`);
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      throw error;
    }
  };

  // Función para obtener un casino por ID
  const getCasinoById = async (casinoId) => {
    try {
      const res = await getCasinoRequest(casinoId);
      return res; // Devolver la respuesta para manejar en el frontend
    } catch (error) {
      console.error("Error al obtener el casino por ID:", error);
      throw error;
    }
  };

  return (
    <CasinosContext.Provider
      value={{
        casinos,
        createCasino,
        updateCasino,
        deleteCasino,
        deleteDocument,
        getCasinoById, // Hacemos disponible la función para obtener un casino por ID
      }}
    >
      {children}
    </CasinosContext.Provider>
  );
}
