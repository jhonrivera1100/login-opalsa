import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import HeaderRespuestas from "../components/HeaderRespOrd";
import Modal from "../components/ModalNotificaciones";
import ModalComponentes from "../components/modalCompUser";
import ModalRespOrden from "../components/modalRespOrden";

const RespuestasOrden = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [showCompUserModal, setShowCompUserModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false); 
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
      const response = await axios.get('/ordenes');
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
        orden.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDate) {
      filtered = filtered.filter((orden) =>
        formatDate(orden.fechaOrden) === filterDate
      );
    }
    setFilteredOrdenes(filtered);
  };

  const handleShowMore = (orden) => {
    setSelectedOrden(orden); // Set the selected order to pass to the modal
    setShowOrderModal(true); // Open the modal
  };

  const handleModalClose = () => {
    setShowOrderModal(false); // Close the modal
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  const updateOrdenInState = (updatedOrden) => {
    setOrdenes((prevOrdenes) =>
      prevOrdenes.map((orden) =>
        orden._id === updatedOrden._id ? updatedOrden : orden
      )
    );
  };

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
            placeholder="Buscar por número de orden"
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
        <div className="h-[600px]  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
            {filteredOrdenes.map((orden) => (
              <div
                key={orden._id}
                className={`w-[300px] rounded-xl p-6 text-center shadow-xl h-[400px] ${
                  orden.estadoOrden === 'Orden aprobada' ? "bg-green-200" : "bg-white"
                }`}
              >
                <div className="mx-auto flex h-16 w-16 -translate-y-3 transform items-center justify-center rounded-full bg-teal-400 shadow-lg shadow-teal-500/40">
                  <svg
                    viewBox="0 0 33 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                  >
                    <path
                      d="M24.75 23H8.25V28.75H24.75V23ZM32.3984 9.43359L23.9852 0.628906C23.5984 0.224609 23.0742 0 22.5242 0H22V11.5H33V10.952C33 10.3859 32.7852 9.83789 32.3984 9.43359ZM19.25 12.2188V0H2.0625C0.919531 0 0 0.961328 0 2.15625V43.8438C0 45.0387 0.919531 46 2.0625 46H30.9375C32.0805 46 33 45.0387 33 43.8438V14.375H21.3125C20.1781 14.375 19.25 13.4047 19.25 12.2188ZM5.5 6.46875C5.5 6.07164 5.80766 5.75 6.1875 5.75H13.0625C13.4423 5.75 13.75 6.07164 13.75 6.46875V7.90625C13.75 8.30336 13.4423 8.625 13.0625 8.625H6.1875C5.80766 8.625 5.5 8.30336 5.5 7.90625V6.46875ZM5.5 12.2188C5.5 11.8216 5.80766 11.5 6.1875 11.5H16.5C16.8798 11.5 17.1875 11.8216 17.1875 12.2188V13.6562C17.1875 14.0534 16.8798 14.375 16.5 14.375H6.1875C5.80766 14.375 5.5 14.0534 5.5 13.6562V12.2188ZM27.5 39.5312C27.5 39.9284 27.1923 40.25 26.8125 40.25H6.1875C5.80766 40.25 5.5 39.9284 5.5 39.5312V38.0938C5.5 37.6966 5.80766 37.375 6.1875 37.375H26.8125C27.1923 37.375 27.5 37.6966 27.5 38.0938V39.5312Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="text-xl font-bold">{orden.numeroOrden}</div>
                <div className="text-sm text-gray-500 mt-2">
                  {orden.fechaOrden ? formatDate(orden.fechaOrden) : 'Fecha no disponible'}
                </div>
                <div className="text-sm text-gray-700 mt-4">
                  Estado: {orden.estadoOrden}
                </div>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleShowMore(orden)} // Open modal on click
                >
                  Ver más
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showOrderModal && (
        <ModalRespOrden
          isOpen={showOrderModal}
          onClose={handleModalClose}
          orden={selectedOrden}
        />
      )}

      {/* Modal para mostrar la descripción completa */}
      {showDescriptionModal && (
        <Modal
          isOpen={showDescriptionModal}
          onClose={() => setShowDescriptionModal(false)}
          title="Descripción Completa"
        >
          <p>{descripcionCompleta}</p>
        </Modal>
      )}

      {/* Modal para mostrar la información del usuario */}
      {showUserModal && (
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title="Información del Usuario"
        >
          <p>{usuarioCompleto}</p>
        </Modal>
      )}

      {/* Modal para mostrar el número de serie de la máquina */}
      {showSerialModal && (
        <Modal
          isOpen={showSerialModal}
          onClose={() => setShowSerialModal(false)}
          title="Número de Serie"
        >
          <p>{serialCompleto}</p>
        </Modal>
      )}

      {/* Modal para mostrar el modal de componentes */}
      {showCompUserModal && (
        <ModalComponentes
          isOpen={showCompUserModal}
          onClose={() => handleModalClose(null)}
          orden={selectedOrden}
          onUpdate={updateOrdenInState}
        />
      )}
    </div>
  );
};

export default RespuestasOrden;
