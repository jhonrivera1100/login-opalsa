import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import HeaderRespuestas from "../components/HeaderRespOrd";
import Modal from "../components/ModalNotificaciones";

const RespuestasOrden = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [selectedOrden, setSelectedOrden] = useState(null);
  const [descripcionCompleta, setDescripcionCompleta] = useState("");
  const [usuarioCompleto, setUsuarioCompleto] = useState("");
  const [serialCompleto, setSerialCompleto] = useState("");

  const { user, loading } = useAuth();

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

  const handleAccept = () => {
    setShowModal(false);
  };

  const handleShowMore = (orden) => {
    setSelectedOrden(orden);
    setShowModal(true);
  };

  const handleDescriptionClick = (descripcionOrden) => {
    setDescripcionCompleta(descripcionOrden);
    setShowDescriptionModal(true);
  };

  const handleUserClick = (usuario) => {
    setUsuarioCompleto(usuario.username || "Desconocido");
    setShowUserModal(true);
  };

  const handleSerialClick = (nroSerieMaquina) => {
    setSerialCompleto(nroSerieMaquina);
    setShowSerialModal(true);
  };

  const updateOrdenInState = (updatedOrden) => {
    setOrdenes((prevOrdenes) => 
      prevOrdenes.map((orden) =>
        orden._id === updatedOrden._id ? updatedOrden : orden
      )
    );
  };

  const handleModalClose = async (updatedOrden) => {
    setShowSobrantesModal(false);
    if (updatedOrden) {
      updateOrdenInState(updatedOrden); // Actualiza el estado con la orden modificada
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="lg:col-span-3 xl:col-span-3 p-4 lg:p-8">
      <Navbar />
      <div className="mb-4 flex flex-col lg:flex-row lg:justify-center">
        <HeaderRespuestas />
      </div>
      <div className="w-full pt-4 pl-[100px]">
        <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {ordenes.map((orden) => (
              <div
                key={orden._id}
                className={`relative py-6 px-6 rounded-3xl w-[250px] my-4 shadow-xl ${orden.aceptado ? 'bg-green-200' : 'bg-white'}`}
              >
                <div className="">
                  <p className=" flex justify-center text-xl text-sidebar-100 font-bold mb-5">Mi Orden </p>
                  <div className="text-gray-600 mb-2">
                    <strong>Orden:</strong>{" "}
                    <span
                      className={`cursor-pointer ${orden.descripcionOrden.length > 10 ? "text-gray-500" : ""}`}
                      onClick={() => {
                        if (orden.descripcionOrden.length > 10) {
                          handleDescriptionClick(orden.descripcionOrden);
                        }
                      }}
                    >
                      {orden.descripcionOrden.length > 10
                        ? `${orden.descripcionOrden.substring(0, 8)}...`
                        : orden.descripcionOrden}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <strong>Maquina Serial:</strong>{" "}
                    <span
                      className="text-gray-500 cursor-pointer"
                      onClick={() => handleSerialClick(orden.nroSerieMaquina)}
                    >
                      {orden.nroSerieMaquina}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <strong>Ubicación Maquina:</strong> <br />
                    {orden.ubicacionMaquina}
                  </div>
                  <div className="text-gray-600 mb-2">
                    <strong>Usuario:</strong>{" "}
                    <span
                      className="text-gray-500 cursor-pointer"
                      onClick={() => handleUserClick(orden.usuario)}
                    >
                      {orden.usuario?.username || "Desconocido"}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <strong>Fecha:</strong> {new Date(orden.fechaOrden).toLocaleDateString()}
                  </div>

                  <div className="text-gray-600 mb-2">
                    <strong>Componentes:</strong>
                    <ul>
                      {orden.componentes.slice(0, 1).map((componente, index) => (
                        <li key={`${componente.serialComponente}-${index}`}>
                          {componente.nombreComponente} <br /> (Serial: {componente.serialComponente})
                        </li>
                      ))}
                      {orden.componentes.length > 1 && (
                        <li className="text-blue-500 cursor-pointer" onClick={() => handleShowMore(orden)}>
                          Ver más...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          title="Componentes"
          onClose={handleAccept}
        >
          <h2 className="font-bold text-2xl mb-3">
            Componentes 
          </h2>
          <ul className="text-gray-600 mb-2">
            {selectedOrden.componentes.map((componente, index) => (
              <li key={`${componente.serialComponente}-${index}`}>
                {componente.nombreComponente} <br /> (Serial: {componente.serialComponente})
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {showDescriptionModal && (
        <Modal
          title="Descripción Completa de la Orden"
          onClose={() => setShowDescriptionModal(false)}
        >
          <h2 className="font-bold text-2xl mb-3">Descripción Completa</h2>
          <p className="text-gray-600 mb-2">{descripcionCompleta}</p>
        </Modal>
      )}

      {showUserModal && (
        <Modal
          title="Usuario Completo"
          onClose={() => setShowUserModal(false)}
        >
          <h2 className="font-bold text-2xl mb-3">Usuario</h2>
          <p className="text-gray-600 mb-2">{usuarioCompleto}</p>
        </Modal>
      )}

      {showSerialModal && (
        <Modal
          title="Número de Serie Completo"
          onClose={() => setShowSerialModal(false)}
        >
          <h2 className="font-bold text-2xl mb-3">Número de Serie</h2>
          <p className="text-gray-600 mb-2">{serialCompleto}</p>
        </Modal>
      )}
    </div>
  );
};

export default RespuestasOrden;
