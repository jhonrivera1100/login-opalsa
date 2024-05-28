import React, { useState } from "react";
import ModalMaquina from "./ModalMaquina"; // Asegúrate de importar correctamente

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
        className={`max-w-sm rounded overflow-hidden shadow-lg mx-4 my-4 transition duration-300 transform hover:shadow-xl`}
        onClick={toggleModal}
      >
        <img
          src={maquina.imgMaquina}
          alt={maquina.nombreMaquina}
          className="w-full"
        />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{maquina.nombreMaquina}</div>
          <p className="text-gray-700 text-base">
            <strong>Número de Serie:</strong> {maquina.nroSerieMaquina}
            <br />
            <strong>Marca:</strong> {maquina.marcaMaquina}
            <br />
            <strong>Estado:</strong> {maquina.estadoMaquina}
            <br />
            <strong>Ubicación:</strong> {maquina.ubicacionMaquina}
            <br />
          </p>
        </div>
      </div>
      {showModal && <ModalMaquina maquina={maquina} onClose={toggleModal} />}
    </div>
  );
}

export default MaquinaCard;
