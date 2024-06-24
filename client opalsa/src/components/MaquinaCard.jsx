import React, { useState } from "react";
import ModalMaquina from "./ModalMaquina";

function MaquinaCard({ maquina }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="wrapper antialiased text-gray-900">
      {showModal && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-70"
          onClick={toggleModal}
        ></div>
      )}
      <div
        className="max-w-sm rounded-lg py-2 overflow-hidden transition-transform duration-300 cursor-pointer mx-2 transform hover:-translate-y-2"
        onClick={toggleModal}
      >
        <img
          src={maquina.imgMaquina.url}
          alt={maquina.nombreMaquina}
          className="w-full h-[400px] object-cover object-center rounded-lg shadow-lg hover:shadow-xl"
        />
        <div className="relative px-4 -mt-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-baseline">
              <span className="bg-teal-200 text-teal-800 text-xs px-2 inline-block rounded-full uppercase font-semibold tracking-wide">
                {maquina.estadoMaquina === "New" ? "New" : maquina.estadoMaquina}
              </span>
              <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                Serial: {maquina.nroSerieMaquina}
              </div>
            </div>

            <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">
              {maquina.nombreMaquina}
            </h4>

            <div className="mt-1">
              <span className="text-gray-600 text-sm">{maquina.ubicacionMaquina}</span>
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
    </div>
  );
}

export default MaquinaCard;
