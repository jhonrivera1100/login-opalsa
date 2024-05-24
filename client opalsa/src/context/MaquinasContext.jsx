import React, { createContext, useContext, useState } from "react";
import { createMaquinasRequest } from "../api/maquinas.js";

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

  const createMaquina = async (maquinaData) => {
    const res = await createMaquinasRequest(maquinaData);
    console.log(res);
  };

  return (
    <MaquinaContext.Provider
      value={{
        maquinas,
        createMaquina,
      }}
    >
      {children}
    </MaquinaContext.Provider>
  );
}
