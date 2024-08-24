import React, { useState } from "react";
import AgregarIcon from "../assets/agregar_icon.svg";
import ModalAgregar from "./ModalAgregar";

export function BotonAgregar() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-gray-100 mb-3 pl-12">
      <div className="max-w-xl mx-auto flex items-center justify-center">
        <div className="flex items-center">
          <img
            src={AgregarIcon}
            alt="Guardar"
            className="h-8 w-8 cursor-pointer transition-transform transform hover:scale-110 ml-4"
            onClick={openModal}
          />
        </div>
      </div>
      {modalOpen && <ModalAgregar closeModal={closeModal} />}
    </div>
  );
}

export default BotonAgregar;