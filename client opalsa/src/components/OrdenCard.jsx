import React, { useState } from "react";
import { BsFileEarmarkText } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import ModalRespOrden from "./modalRespOrden";

const OrdenCard = ({
  item,
  handleDescriptionClick,
  handleAcceptOrder,
  handleDeleteItem,
  handleOpenSobrantesModal,
  handleAbrirModalOrder,
  
}) => {
  const {
    numeroOrden ="",
    estadoOrden = "Estado desconocido",
    usuario = {},
    descripcionOrden = "Descripción desconocida",
    maquina = {},
    componenteSobrantes = [], 
    _id = "",
    aceptado = false,
    fechaOrden = new Date(),
  } = item || {};

  const {
    nroSerieMaquina = "Número de serie desconocido",
    ubicacionMaquina = "Ubicación desconocida",
  } = maquina || {};

  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  const getIconBackgroundColor = () => {
    switch (estadoOrden) {
      case "Orden en solicitud":
        return "bg-yellow-500";
      case "Orden aprobada":
        return "bg-blue-500";
      case "Orden finalizada":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getFirstTwoNames = (username) => {
    if (!username) return "";
    const names = username.split(" ");
    return names.slice(0, 2).join(" ");
  };

  const fullName = getFirstTwoNames(usuario.username || "");
  const maxLength = 15;
  const truncatedName = fullName.length > maxLength ? `${fullName.substring(0, maxLength)}...` : fullName;

  const openModal = () => {
    setOrdenSeleccionada(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      key={_id}
      className={`relative py-6 px-6 rounded-3xl w-[250px] my-4 shadow-xl ${
        aceptado ? "bg-green-200" : "bg-white"
      }`}
    >
      <div
        className={`text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl ${getIconBackgroundColor()} left-4 -top-4`}
      >
        <BsFileEarmarkText className="w-8 h-8" />
      </div>
      <div className="mt-8">
        <p className="text-xl font-semibold my-2">{estadoOrden}</p>
        <div
          className="relative flex space-x-2 text-gray-400 text-sm"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <FaRegUser className="h-5 w-5" />
          <p>{usuario.username ? truncatedName : "Desconocido"}</p>
          <p>{usuario.cargo}</p>
          {showTooltip && usuario.username && (
            <div className="absolute left-0 top-full mt-1 p-2 bg-black text-white text-sm rounded-md shadow-lg">
              {usuario.username}
            </div>
          )}
        </div>
        <div className="flex space-x-2 text-gray-400 text-sm my-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <p>{new Date(fechaOrden).toLocaleDateString()}</p>
        </div>
        <div className="border-t-2"></div>
        <div className="mt-4">
          <p
            className="text-gray-600 mb-2 cursor-pointer"
            onClick={() => handleDescriptionClick(item)}
          >
            <strong>Descripcion:</strong> <br />
            {descripcionOrden.length > 20
              ? `${descripcionOrden.substring(0, 20)}...`
              : descripcionOrden}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Numero de orden:</strong> <br /> {numeroOrden}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Maquina Serial:</strong> <br /> {nroSerieMaquina}
          </p>
          <p className="text-gray-600 mb-2 ">
            <strong>Ubicación Maquina:</strong> <br />
            {ubicacionMaquina}
          </p>

          <div className="flex justify-center mt-2 space-x-2">
            {(estadoOrden === "Orden en solicitud" ) && (
              <button
                className="bg-green-700 text-white py-1 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
                onClick={() => handleAbrirModalOrder(item)}
              >
                Aprobar orden
              </button>
              
            )}
            {(estadoOrden === "Orden en solicitud" ) && (
              <button
              className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-500 transition-colors duration-300"
              onClick={() => handleDeleteItem(_id, "orden")}
            >
              Descartar Orden
            </button>
              
            )}
            {estadoOrden === "Orden aprobada" && (
              
              <button
              className="bg-blue-700 text-white py-1 px-4 rounded-md hover:bg-blue-500 transition-colors duration-300"
              onClick={() => openModal(item)}
            >
              Inspeccionar orden
            </button>
            )}
            {estadoOrden === "Orden aprobada" && (
              
              <button
                onClick={() => handleOpenSobrantesModal(item)}
                className="bg-green-700 rounded-md py-1 px-4 text-white hover:bg-green-600 transition-colors duration-300"
              >
                Finalizar orden
              </button>
            )}
            {estadoOrden === "Orden finalizada" && (
              <div className="flex justify-between mt-2 space-x-2">
                <button
                  className="bg-blue-700 text-white py-1 px-4 rounded-md hover:bg-blue-500 transition-colors duration-300"
                  onClick={openModal}
                >
                  Resumen
                </button>
                <button
                  className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-500 transition-colors duration-300"
                  onClick={() => handleDeleteItem(_id, "orden")}
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ModalRespOrden
          isOpen={isModalOpen}
          onClose={closeModal}
          orden={ordenSeleccionada}
        />
      )}
    </div>
  );
};

export default OrdenCard;
