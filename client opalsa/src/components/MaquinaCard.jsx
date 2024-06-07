import React, { useState } from "react";
import ModalMaquina from "./ModalMaquina";

function MaquinaCard({ maquina }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      {showModal && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-70"
          onClick={toggleModal}
        ></div>
      )}
      <div
        className={`max-w-[18rem] rounded-lg overflow-hidden shadow-lg mx-2 my-4 transition duration-300 transform hover:shadow-xl hover:-translate-y-1 bg-gray-700 text-white rounded-lg cursor-pointer`}
        onClick={toggleModal}
      >
        <div className="bg-gray-900 text-white py-2 px-4 text-center font-bold">
          Serial: {maquina.nroSerieMaquina}
        </div>
        <div className="relative">
          <img
            src={maquina.imgMaquina.url}
            alt={maquina.nombreMaquina}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gray-900 text-white py-1 px-4 font-bold text-xl text-center">
            {maquina.marcaMaquina}
          </div>
        </div>
        <div className="px-4 py-2">
          <p className="text-sm">
            <strong className="text-sky-300">Nombre:</strong>{" "}
            <span className="text-white">{maquina.nombreMaquina}</span>
            <br />
            <strong className="text-sky-300">Estado:</strong>{" "}
            <span className="text-white">{maquina.estadoMaquina}</span>
            <br />
            <strong className="text-sky-300">Ubicada en:</strong>{" "}
            <span className="text-white">{maquina.ubicacionMaquina}</span>
            <br />
            <strong className="text-sky-300">Fecha de Instalación:</strong>{" "}
            <span className="text-white">{maquina.fechaInstalacionMaquina}</span>
            <br />
          </p>
        </div>
      </div>
      {showModal && <ModalMaquina maquina={maquina} onClose={toggleModal} />}
    </div>
  );
}

export default MaquinaCard;
