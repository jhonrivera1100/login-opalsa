import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ModalOrden from "../components/ModalFormOrden";

const RespuestasOrden = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const { user, loading } = useAuth(); // Añadir loading para verificar la autenticación

  useEffect(() => {
    if (!loading && user) {
      fetchOrdenes();
    }
  }, [user, loading]);

  const fetchOrdenes = async () => {
    try {
      const response = await axios.get(`/ordenes`);
      const ordenesFiltradas = response.data.filter(
        (orden) => orden.usuario._id === user._id
      );
      setOrdenes(ordenesFiltradas);
    } catch (error) {
      console.error("Error al traer las órdenes:", error);
    }
  };

  const handleAccept = (ordenActualizada) => {
    if (ordenActualizada) {
      setOrdenes((prevOrdenes) =>
        prevOrdenes.map((orden) =>
          orden._id === ordenActualizada._id ? ordenActualizada : orden
        )
      );
    }
    setShowModal(false);
  };

  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje mientras se verifica la autenticación
  }

  return (
    <div className="lg:col-span-3 xl:col-span-3 p-4 lg:p-8">
      <Navbar />
      <div className="w-full pt-6 pl-[100px]">
        <div className="h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {ordenes.map((orden) => (
              <div
                key={orden._id}
                className="relative py-6 px-6 rounded-3xl w-[250px] my-4 shadow-xl bg-white"
              >
                <div className="mt-8">
                  <p className="text-xl font-bold my-2">Orden</p>
                  <div className="text-gray-600 mb-2">
                    <strong>Orden:</strong> {orden.descripcionOrden}
                  </div>
                  <div className="text-gray-600 mb-2">
                    <strong>Maquina Serial:</strong> {orden.nroSerieMaquina}
                  </div>
                  <div className="text-gray-600 mb-2 pb-2">
                    <strong>Ubicación Maquina:</strong> <br />
                    {orden.ubicacionMaquina}
                  </div>
                  <div className="text-gray-600 mb-2">
                    <strong>Usuario:</strong> {orden.usuario?.username || "Desconocido"}
                  </div>
                  <div className="text-gray-600 mb-2">
                    <strong>Componentes:</strong>
                    <ul>
                      {orden.componentes.length > 0 ? (
                        orden.componentes.map((componente, index) => {
                          const uniqueKey = `${componente.serialComponente || 'unknown'}-${index}`;
                          return (
                            <li key={uniqueKey}>
                              {componente.nombreComponente} <br /> (Serial: {componente.serialComponente || 'Desconocido'})
                            </li>
                          );
                        })
                      ) : (
                        <li>No hay componentes disponibles todavía.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && 
        <ModalOrden 
          orden={selectedOrden} 
          onClose={handleAccept}
        />
      }
    </div>
  );
};

export default RespuestasOrden;
