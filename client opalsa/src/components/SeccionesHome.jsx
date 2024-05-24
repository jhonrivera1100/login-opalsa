import React, { useState, useEffect } from "react";
import MaquinaCard from "../components/MaquinaCard";
import { getMaquinasRequest } from "../api/maquinas";

function SeccionesHome() {
  const [section, setSection] = useState("Empresas");
  const [maquinas, setMaquinas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMaquinasRequest();
        setMaquinas(response.data);
      } catch (error) {
        console.error("Error al cargar las máquinas:", error);
      }
    };

    if (section === "Maquinas") {
      fetchData();
    }
  }, [section]);

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      
      <div className="flex justify-center mt-4">
        <button className={section === "Empresas" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"} onClick={() => setSection("Empresas")}>Empresas</button>
        <button className={section === "Casinos" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"} onClick={() => setSection("Casinos")}>Casinos</button>
        <button className={section === "Maquinas" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"} onClick={() => setSection("Maquinas")}>Máquinas</button>
      </div>
      
      <div className="mt-4">
        {section === "Maquinas" && (
          <div className="flex flex-wrap justify-center">
            {maquinas.map((maquina) => (
              <MaquinaCard key={maquina._id} maquina={maquina} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SeccionesHome;
