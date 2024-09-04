import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import HeaderRespuestas from "../components/HeaderRespOrd";
import Modal from "../components/ModalNotificaciones";

const RespuestasOrden = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
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

  useEffect(() => {
    filterOrdenes();
  }, [searchTerm, filterDate, ordenes]);

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

  const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  };

  const filterOrdenes = () => {
    let filtered = ordenes;
    if (searchTerm) {
      filtered = filtered.filter((orden) =>
        orden.nroSerieMaquina.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDate) {
      filtered = filtered.filter((orden) =>
        formatDate(orden.fechaOrden) === filterDate
      );
    }
    setFilteredOrdenes(filtered);
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
        <div className="mb-4 flex gap-4 flex justify-center pr-[00px]">
          <input
            type="text"
            placeholder="Buscar por número de serie"
            className="px-4 py-2 border rounded-lg w-[400px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            className="px-4 py-2 border rounded-lg"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredOrdenes.map((orden) => (
              <div
                key={orden._id}
                className={`relative py-6 px-8 rounded-3xl w-[260px] my-4 shadow-xl ${
                  orden.aceptado ? "bg-green-200" : "bg-white"
                }`}
              >
                <div className="">
                  <p className="flex justify-center text-xl text-sidebar-100 font-bold mb-5">
                    Mi Orden
                  </p>
                  <div className="text-gray-600 mb-3">
                    <strong>Orden:</strong>{" "}
                    <span
                      className={`cursor-pointer ${
                        orden.descripcionOrden.length > 10
                          ? "text-gray-500 hover:text-blue-700"
                          : ""
                      }`}
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
                  <div className="text-gray-600 mb-3">
                    <strong>Maquina Serial:</strong>{" "}
                    <span
                      className="text-gray-500 cursor-pointer hover:text-blue-700"
                      onClick={() => handleSerialClick(orden.nroSerieMaquina)}
                    >
                      {orden.nroSerieMaquina}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-3">
                    <strong>Ubicación Maquina:</strong> <br />
                    {orden.ubicacionMaquina}
                  </div>
                  <div className="text-gray-600 mb-3">
                    <strong>Usuario:</strong>{" "}
                    <span
                      className="text-gray-500 cursor-pointer hover:text-blue-700"
                      onClick={() => handleUserClick(orden.usuario)}
                    >
                      {orden.usuario?.username || "Desconocido"}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-3">
                    <strong>Fecha:</strong>{" "}
                    {formatDate(orden.fechaOrden)}
                  </div>
                  <div className="text-gray-600 mb-3">
                    <strong>Componentes:</strong>
                    <ul className="space-y-2">
                      {orden.componentes.slice(0, 1).map((componente, index) => (
                        <li key={`${componente.serialComponente}-${index}`}>
                          {componente.nombreComponente} <br /> (Serial:{" "}
                          {componente.serialComponente})
                        </li>
                      ))}
                      {orden.componentes.length > 1 && (
                        <li
                          className="text-blue-500 cursor-pointer"
                          onClick={() => handleShowMore(orden)}
                        >
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
        <Modal title="Componentes" onClose={handleAccept}>
          <h2 className="font-bold text-2xl mb-5">Componentes</h2>
          <ul className="text-gray-600 space-y-3">
            {selectedOrden.componentes.map((componente, index) => (
              <li key={`${componente.serialComponente}-${index}`}>
                {componente.nombreComponente} <br /> (Serial:{" "}
                {componente.serialComponente})
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
          <h2 className="font-bold text-2xl mb-5">Descripción Completa</h2>
          <p className="text-gray-600 mb-5">{descripcionCompleta}</p>
        </Modal>
      )}

      {showUserModal && (
        <Modal title="Usuario Completo" onClose={() => setShowUserModal(false)}>
          <h2 className="font-bold text-2xl mb-5">Usuario</h2>
          <p className="text-gray-600 mb-5">{usuarioCompleto}</p>
        </Modal>
      )}

      {showSerialModal && (
        <Modal title="Número de Serie" onClose={() => setShowSerialModal(false)}>
          <h2 className="font-bold text-2xl mb-5">Número de Serie</h2>
          <p className="text-gray-600 mb-5">{serialCompleto}</p>
        </Modal>
      )}
    </div>
  );
};

export default RespuestasOrden;
