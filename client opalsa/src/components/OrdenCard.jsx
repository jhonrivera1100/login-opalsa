import React, { useState } from "react";
import { BsFileEarmarkText } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";

const OrdenCard = ({
  item,
  handleCheckboxAceptar,
  handleDescriptionClick,
  handleAcceptOrder,
  handleDeleteItem,
  handleOpenSobrantesModal,
}) => {
  // Verifica si item está definido y tiene las propiedades necesarias
  const {
    estadoOrden = "Estado desconocido",
    usuario = {},
    descripcionOrden = "Descripción desconocida",
    maquina = {},
    componenteSobrantes = [],
    _id = "",
    aceptado = false,
    fechaOrden = new Date(), // Usa la fecha actual si no está definida
  } = item || {};

  const {
    nroSerieMaquina = "Número de serie desconocido",
    ubicacionMaquina = "Ubicación desconocida",
  } = maquina || {};

  // Estado para mostrar el tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  // Define los colores de fondo para cada estado
  const getIconBackgroundColor = () => {
    switch (estadoOrden) {
      case "Orden en solicitud":
        return "bg-yellow-500"; // Fondo amarillo
      case "Orden aprobada":
        return "bg-blue-500"; // Fondo azul
      case "Orden Finalizada":
        return "bg-red-500"; // Fondo rojo
      default:
        return "bg-gray-500"; // Fondo gris para estados desconocidos
    }
  };

  // Divide el nombre del usuario en palabras y devuelve los primeros dos nombres completos
  const getFirstTwoNames = (username) => {
    if (!username) return "";
    const names = username.split(" ");
    return names.slice(0, 2).join(" "); // Devuelve los primeros dos nombres completos
  };

  // Obtiene los primeros dos nombres del usuario
  const fullName = getFirstTwoNames(usuario.username || "");
  const maxLength = 15; // Ajusta el límite de caracteres si es necesario
  const truncatedName = fullName.length > maxLength ? `${fullName.substring(0, maxLength)}...` : fullName;

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
            <strong>Orden:</strong> <br />
            {descripcionOrden.length > 10
              ? `${descripcionOrden.substring(0, 10)}...` // Cambiado a 10 para consistencia
              : descripcionOrden}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Maquina Serial:</strong> <br /> {nroSerieMaquina}
          </p>
          <p className="text-gray-600 mb-2 ">
            <strong>Ubicación Maquina:</strong> <br />
            {ubicacionMaquina}
          </p>

          {/* Renderizado condicional de botones */}
          <div className="flex justify-center mt-2 space-x-2">
            {(estadoOrden === "Orden en solicitud" || estadoOrden === "Orden aprobada") && (
              <button
                className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
                onClick={() => handleAcceptOrder(item)}
              >
                Inspeccionar orden
              </button>
            )}
            {estadoOrden === "Orden aprobada" && (
              <button
                onClick={() => handleOpenSobrantesModal(item)}
                className="bg-sky-500 rounded-md py-1 px-4 text-white hover:bg-sky-700 transition-colors duration-300"
              >
                Finalizar orden
              </button>
            )}
            {estadoOrden === "Orden Finalizada" && (
              <button
                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                onClick={() => handleDeleteItem(_id, "orden")}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdenCard;
