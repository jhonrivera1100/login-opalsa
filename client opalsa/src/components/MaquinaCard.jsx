import React, { useState } from "react";
import ModalMaquina from "./ModalMaquina";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

function MaquinaCard({ maquina }) {
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  // Determinar la clase de fondo condicionalmente para el texto del estado
  const estadoClase =
    maquina.estadoMaquina === "inactivo"
      ? "bg-red-200 text-red-800"
      : "bg-teal-200 text-teal-800";

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-70"
          onClick={toggleModal}
        ></div>
      )}
      <div
        className="max-w-sm rounded-lg py-2 overflow-hidden transition-transform duration-300 cursor-pointer mx-2 transform hover:scale-105"
        onClick={toggleModal}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
          {maquina.imgMaquina && maquina.imgMaquina.url ? (
            <img
              src={maquina.imgMaquina.url}
              className="w-full h-[400px] object-cover object-center rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-300 flex items-center justify-center rounded-lg shadow-lg">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
          {hovered && (
            <div className="absolute inset-0 bg-white bg-opacity-50 transition-opacity duration-300"></div>
          )}
        </div>
        <div className="relative px-4 -mt-16">
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl">
            <div className="flex items-baseline">
              <span
                className={`text-xs px-2 inline-block rounded-full uppercase font-semibold tracking-wide ${estadoClase}`}
              >
                {maquina.estadoMaquina === "New"
                  ? "New"
                  : maquina.estadoMaquina}
              </span>
              <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                {maquina.marcaMaquina}
              </div>
            </div>

            <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">
              {maquina.nroSerieMaquina}
            </h4>

            <div className="mt-1 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
              <span className="text-gray-600 text-sm">
                {maquina.ubicacionMaquina}
              </span>
            </div>
            <div className="mt-4">
              <span className="text-teal-600 text-md font-semibold">
                Instalación:
              </span>{" "}
              <span className="text-sm text-gray-600">
                {maquina.fechaInstalacionMaquina}
              </span>
            </div>
          </div>
        </div>
      </div>
      {showModal && <ModalMaquina maquina={maquina} onClose={toggleModal} />}
    </>
  );
}

export default MaquinaCard;
