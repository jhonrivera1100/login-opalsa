import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // Asegúrate de que la ruta es correcta
import Navbar from "../components/Navbar";
import UserHeader from "../components/UserHeader";

function Historial() {
  const [mantenimientos, setMantenimientos] = useState([]);

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const response = await axios.get("/mantenimientos");
        setMantenimientos(response.data);
      } catch (error) {
        console.error("Error al obtener los mantenimientos:", error);
      }
    };

    fetchMantenimientos();
  }, []);

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Navbar /> {/* Componente Navbar */}
      <UserHeader /> {/* Componente UserHeader */}
      <div className="container mx-auto px-4 py-8 w-[1300px]">
        <h2 className="text-2xl font-bold mb-4">Historial de Mantenimientos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2">Número de Serie</th>
                <th className="py-2 px-4 border-b-2">Tipo de Mantenimiento</th>
                <th className="py-2 px-4 border-b-2">Fecha de Mantenimiento</th>
                <th className="py-2 px-4 border-b-2">Descripción</th>
                <th className="py-2 px-4 border-b-2">Archivo</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.map((mantenimiento) => (
                <tr key={mantenimiento._id}>
                  <td className="py-2 px-4 border-b">{mantenimiento.numeroSerie}</td>
                  <td className="py-2 px-4 border-b">{mantenimiento.tipoMantenimiento}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(mantenimiento.fechaMantenimiento).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{mantenimiento.descripcion}</td>
                  <td className="py-2 px-4 border-b">
                    {mantenimiento.archivo ? (
                      <a href={mantenimiento.archivo} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                        Ver archivo
                      </a>
                    ) : (
                      "No adjunto"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Historial;