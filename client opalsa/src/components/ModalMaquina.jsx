import React, { useState, useEffect } from "react";
import { useComponentes } from "../context/ComponentesContext";
import AgregarComponenteModal from "./AgregarComponenteModal";
import TransferirComponenteModal from "./TransferirComponenteModal"; // Asumiendo que existe un modal similar para transferir componentes

function ModalMaquina({ maquina, onClose }) {
  const { componentes, getComponentes } = useComponentes();
  
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showTransferirModal, setShowTransferirModal] = useState(false);

  useEffect(() => {
    getComponentes(); 
  }, []);

  const sortedComponentes = componentes
    .filter((componente) => componente.maquina === maquina._id)
    .sort((a, b) => a.nombreComponente.localeCompare(b.nombreComponente));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
      <div className="bg-gray-100 rounded-lg overflow-hidden shadow-xl max-w-7xl w-full mt-8 p-10 flex flex-col relative">
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
        
        <div className="flex justify-between mb-8">
          <div className="w-1/3 pr-4">
            <h2 className="text-2xl font-bold mb-6 text-black">{maquina.nombreMaquina}</h2>
            <div className="mb-4">
              <p className="text-black mb-1"><strong>Número de Serie:</strong> {maquina.nroSerieMaquina}</p>
              <p className="text-black mb-1"><strong>Modelo:</strong> {maquina.modeloMaquina}</p>
              <p className="text-black mb-1"><strong>Marca:</strong> {maquina.marcaMaquina}</p>
              <p className="text-black mb-1"><strong>Software:</strong> {maquina.softwareMaquina}</p>
              <p className="text-black mb-1"><strong>Juego:</strong> {maquina.juegoMaquina}</p>
              <p className="text-black mb-1"><strong>Estado:</strong> {maquina.estadoMaquina}</p>
              <p className="text-black mb-1"><strong>Descripción:</strong> {maquina.descripcionMaquina}</p>
              <p className="text-black mb-1"><strong>Ubicación:</strong> {maquina.ubicacionMaquina}</p>
              <p className="text-black mb-1"><strong>Fecha de Instalación:</strong> {maquina.fechaInstalacionMaquina}</p>
              <p className="text-black mb-1"><strong>Proveedor:</strong> {maquina.proveedorMaquina}</p>
            </div>
            <div className="flex space-x-4 mt-4">
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
          </div>

          <div className="w-2/3 pl-4">
            <h3 className="text-xl text-center font-bold mb-4 text-black">Componentes</h3>
            <hr className="my-4 border-gray-400" /> {/* Línea divisoria */}
            <ul className="list-none pl-0">
              <li className="font-bold text-white bg-blue-500 mb-2 grid grid-cols-4 gap-4 p-2">
                <span>Nombre</span>
                <span>Serial</span>
                <span>Marca</span>
                <span>Documento</span>
              </li>
              {sortedComponentes.map((componente) => (
                <li className="text-black mb-1 grid grid-cols-4 gap-4 p-2 border-b border-gray-300" key={componente._id}>
                  <span>{componente.nombreComponente}</span>
                  <span>{componente.serialComponente}</span>
                  <span>{componente.marcaComponente}</span>
                  <span>{componente.documentoComponente}</span>
                </li>
              ))}
            </ul>
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
            onClose={() => setShowTransferirModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ModalMaquina;
