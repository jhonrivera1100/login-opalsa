import React, { useState, useEffect } from "react";
import MaquinaCard from "../components/MaquinaCard";
import { getMaquinasRequest } from "../api/maquinas";
import { getCasinosRequest } from "../api/casinos";
import CasinoCard from "../components/casinoCard"; // Asegúrate de que este sea el camino correcto al componente

function SeccionesHome() {
  const [section, setSection] = useState("Empresas");
  const [maquinas, setMaquinas] = useState([]);
  const [casinos, setCasinos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (section === "Maquinas") {
        try {
          const response = await getMaquinasRequest();
          setMaquinas(response.data);
        } catch (error) {
          console.error("Error al cargar las máquinas:", error);
        }
      } else if (section === "Casinos") {
        try {
          const response = await getCasinosRequest();
          setCasinos(response.data);
        } catch (error) {
          console.error("Error al cargar los casinos:", error);
        }
      }
    };

    fetchData();
  }, [section]);

  // Contenedor común para cada sección
  const renderSectionContent = () => {
    return (
      <div className="mx-auto border border-gray-200 w-9/12 h-144 overflow-auto bg-slate-300 p-4">
        <div className="grid grid-cols-4 gap-1">
          {/* Aquí irá el contenido específico de cada sección */}
          {section === "Maquinas" && maquinas.map((maquina) => (
            <MaquinaCard key={maquina._id} maquina={maquina} />
          ))}
          {section === "Casinos" && casinos.map((casino) => (
            <CasinoCard key={casino._id} casino={casino} />
          ))}
          {section === "Empresas" && (
            <p>Empresas placeholder content</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="flex justify-center mt-4">
        <button
          className={section === "Empresas" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"}
          onClick={() => setSection("Empresas")}
        >
          Empresas
        </button>
        <button
          className={section === "Casinos" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"}
          onClick={() => setSection("Casinos")}
        >
          Casinos
        </button>
        <button
          className={section === "Maquinas" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"}
          onClick={() => setSection("Maquinas")}
        >
          Máquinas
        </button>
      </div>

      <div className="mt-4">
        {renderSectionContent()}
      </div>
    </div>
  );
}

export default SeccionesHome;
