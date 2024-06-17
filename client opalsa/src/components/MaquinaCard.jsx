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
        className={`max-w-[18rem] overflow-hidden shadow-lg mx-1 my-1 rounded-lg transition duration-300 transform hover:-translate-y-2 bg-gray-700 text-white cursor-pointer`}
        onClick={toggleModal}
      >
        <div className="bg-gray-900 text-white py-1 px-4 text-center font-semibold truncate">
          Serial: {maquina.nroSerieMaquina}
        </div>
        <div className="relative">
          <img
            src={maquina.imgMaquina.url}
            alt={maquina.nombreMaquina}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gray-900 text-white px-4 font-semibold text-lg text-center truncate">
            {maquina.marcaMaquina}
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="flex text-sm">
            <strong className="text-sky-300 mr-1">Nombre: </strong>{" "}
            <span className="text-white truncate">{maquina.nombreMaquina}</span>
          </div>
          <div className="flex text-sm">
            <strong className="text-sky-300 mr-1">Estado: </strong>{" "}
            <span className="text-white truncate">{maquina.estadoMaquina}</span>
          </div>
          <div className="flex text-sm">
            <strong className="text-sky-300 mr-1">Ubicacion: </strong>{" "}
            <span className="text-white truncate">{maquina.ubicacionMaquina}</span>
          </div>
          <div className="flex text-sm">
            <strong className="text-sky-300 mr-1">Fecha de Instalación: </strong>{" "}
            <span className="text-white truncate">{maquina.fechaInstalacionMaquina}</span>
          </div>
        </div>
      </div>
      {showModal && <ModalMaquina maquina={maquina} onClose={toggleModal} />}
    </div>
  );
}

export default MaquinaCard;
