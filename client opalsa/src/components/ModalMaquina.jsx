import React, { useState, useEffect } from "react";
import { useComponentes } from "../context/ComponentesContext";
import AgregarComponenteModal from "./AgregarComponenteModal";
import TransferirComponenteModal from "./TransferirComponenteModal";

function ModalMaquina({ maquina, onClose }) {
  const { componentes, getComponentes } = useComponentes();

  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showTransferirModal, setShowTransferirModal] = useState(false);
  const [showComponentes, setShowComponentes] = useState(false); // Estado para manejar la visibilidad de los componentes

  useEffect(() => {
    getComponentes();
  }, []);

  const sortedComponentes = componentes
    .filter((componente) => componente.maquina === maquina._id)
    .sort((a, b) => a.nombreComponente.localeCompare(b.nombreComponente));

  const toggleComponentes = () => {
    setShowComponentes(!showComponentes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="bg-sky-100 shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative text-sm">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col h-full">
          {/* Parte superior: Imagen y datos de la máquina con fondo común */}
          <div className="flex mb-6 h-1/2 bg-slate-600 p-4 rounded-lg relative">
            {" "}
            {/* Fondo común y padding */}
            <div className="w-1/3 pr-4 flex flex-col items-center justify-center relative">
              <div className="absolute top-0 left-0 w-[90%] bg-gray-900 text-white text-center py-1 rounded-t-lg">
                {" "}
                {/* Anchura ajustada */}
                <strong>Serial: {maquina.nroSerieMaquina}</strong>{" "}
                {/* Franja Número de Serie */}
              </div>
              <img
                src={maquina.imgMaquina.url}
                alt={maquina.nombreMaquina}
                className="w-40 h-60 object-cover mb-4 bg-white mt-7" // Fondo de la imagen
              />
              <div className="absolute bottom-0 left-0 w-[90%] bg-gray-900 text-white text-center py-1 rounded-b-lg mx-auto">
                {" "}
                {/* Anchura ajustada */}
                <strong>Marca: {maquina.marcaMaquina}</strong>{" "}
                {/* Franja Marca */}
              </div>
            </div>
            <div className="w-2/3 pl-4 overflow-auto text-white">
              <h2 className="text-xl font-bold mb-2">Datos de la maquina:</h2>
              <div className="space-y-0.5">
                <p>
                  <strong className="text-sky-300">Nombre:</strong>{" "}
                  {maquina.nombreMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">Modelo:</strong>{" "}
                  {maquina.modeloMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">Software:</strong>{" "}
                  {maquina.softwareMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">Juego:</strong>{" "}
                  {maquina.juegoMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">Estado:</strong>{" "}
                  {maquina.estadoMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">Descripción:</strong>{" "}
                  {maquina.descripcionMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">Ubicación:</strong>{" "}
                  {maquina.ubicacionMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">
                    Fecha de Instalación:
                  </strong>{" "}
                  {maquina.fechaInstalacionMaquina}
                </p>
                <p>
                  <strong className="text-sky-300">Proveedor:</strong>{" "}
                  {maquina.proveedorMaquina}
                </p>
              </div>
            </div>
          </div>

          {/* Parte inferior: Lista de componentes */}
          <div className="flex-1 overflow-auto">
            <div
              className="flex items-center justify-center space-x-2 text-lg text-center rounded-lg font-bold text-gray-600 p-4 cursor-pointer hover:bg-gray-300" // Flex para alineación
              onClick={toggleComponentes}
            >
              <span>Componentes de la máquina</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transform transition-transform ${
                  showComponentes ? "rotate-180" : ""
                }`} // Rotación
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {showComponentes && (
              <>
                <ul className="list-none pl-0">
                  <li className="font-semibold text-white bg-gray-900 mb-2 grid grid-cols-4 gap-4 p-2">
                    <span>NOMBRE</span>
                    <span>SERIAL</span>
                    <span>MARCA</span>
                    <span>DOCUMENTO</span>
                  </li>
                  {sortedComponentes.map((componente) => (
                    <li
                      className="text-gray-500 mb-1 grid grid-cols-4 gap-4 font-medium p-2 border-b border-gray-300"
                      key={componente._id}
                    >
                      <span>{componente.nombreComponente}</span>
                      <span>{componente.serialComponente}</span>
                      <span>{componente.marcaComponente}</span>
                      <span>{componente.documentoComponente}</span>
                    </li>
                  ))}
                </ul>{" "}
                {/* Botones en la parte inferior */}
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setShowAgregarModal(true)}
                    className="bg-blue-500 text-white px-2 py-2 rounded"
                  >
                    Agregar Componente
                  </button>
                  <button
                    onClick={() => setShowTransferirModal(true)}
                    className="bg-green-500 text-white px-2 py-2 rounded"
                  >
                    Transferir Componente
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {showAgregarModal && (
          <AgregarComponenteModal
            maquinaId={maquina._id}
            onClose={() => setShowAgregarModal(false)}
          />
        )}

        {showTransferirModal && (
          <TransferirComponenteModal
            maquina={maquina}
            componentes={componentes}
            onClose={() => setShowTransferirModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ModalMaquina;
