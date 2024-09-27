import React, { useState, useEffect } from "react";
import { useComponentes } from "../context/ComponentesContext";
import AgregarComponenteModal from "./AgregarComponenteModal";
import TransferirComponenteModal from "./TransferirComponenteModal";
import TransferirMaquinaModal from "./TransferirMaquinaModal";
import ComponentesTable from "./ComponentesTable";
import CardMaquinaModal from "./CardMaquinaModal";
import {
  deleteComponentesRequest,
  updateComponentesRequest,
} from "../api/componentes";
import { deleteMaquinasRequest, updateMaquinasRequest } from "../api/maquinas";

function ModalMaquina({ maquina, onClose }) {
  const { componentes, getComponentes } = useComponentes();

  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showTransferirModal, setShowTransferirModal] = useState(false);
  const [showComponentes, setShowComponentes] = useState(false);
  const [showTransferirMaquinaModal, setShowTransferirMaquinaModal] =
    useState(false);
  const [estadoMaquina, setEstadoMaquina] = useState(maquina.estadoMaquina);
  const [editComponentId, setEditComponentId] = useState(null);
  const [editedComponent, setEditedComponent] = useState({});

  // Cargar componentes cuando el modal se monta
  useEffect(() => {
    getComponentes();
  }, []);

  // Filtrar y ordenar los componentes pertenecientes a la máquina
  const sortedComponentes = componentes
    .filter((componente) => componente.maquina === maquina._id)
    .sort((a, b) => a.nombreComponente.localeCompare(b.nombreComponente));

  const toggleComponentes = () => {
    setShowComponentes(!showComponentes);
  };

  const handleTransferComplete = () => {
    getComponentes();
    setShowTransferirModal(false);
  };

  const handleDeleteComponente = async (componenteId) => {
    try {
      await deleteComponentesRequest(componenteId);
      getComponentes();
    } catch (error) {
      console.error("Error al eliminar el componente:", error);
    }
  };

  const toggleEstadoMaquina = async () => {
    const nuevoEstado = estadoMaquina === "activo" ? "inactivo" : "activo";
    try {
      await updateMaquinasRequest(maquina._id, { estadoMaquina: nuevoEstado });
      setEstadoMaquina(nuevoEstado);
    } catch (error) {
      console.error("Error al cambiar el estado de la máquina:", error);
    }
  };

  const handleEditClick = (componente) => {
    setEditComponentId(componente._id);
    setEditedComponent(componente);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedComponent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      await updateComponentesRequest(editedComponent);
      getComponentes();
      setEditComponentId(null);
    } catch (error) {
      console.error("Error al actualizar el componente:", error);
    }
  };

  const handleCancelClick = () => {
    setEditComponentId(null);
  };

  const handleEliminarMaquina = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta máquina?"
    );
    if (confirmDelete) {
      try {
        await deleteMaquinasRequest(maquina._id);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Error al eliminar la máquina:", error);
      }
    }
  };

  const abrirDocumento = (url) => {
    window.open(url, "_blank");
  };

  const updateMaquina = async (editedMaquina) => {
    try {
      await updateMaquinasRequest(maquina._id, editedMaquina);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando la máquina:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="bg-gray-100 shadow-xl w-full max-w-7xl max-h-[150vh] overflow-y-auto p-6 relative text-sm flex">
        <button
          className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <CardMaquinaModal
          maquina={maquina}
          estadoMaquina={estadoMaquina}
          toggleEstadoMaquina={toggleEstadoMaquina}
          handleEliminarMaquina={handleEliminarMaquina}
          setShowTransferirMaquinaModal={setShowTransferirMaquinaModal}
          updateMaquina={updateMaquina}
        />

        <div className="w-full flex flex-col pl-4 max-h-[90vh] overflow-y-auto">
          <h1 className="text-xl text-slate-500 text-center py-3 font-bold mb-4">
            Componentes en {maquina.marcaMaquina} {maquina.modeloMaquina}
          </h1>
          {sortedComponentes.length === 0 ? (
            <div className="flex flex-col items-center mt-4 space-y-4">
              <span className="text-gray-500 text-lg text-center">
                Esta máquina aún no tiene componentes.
              </span>
              <button
                onClick={() => setShowAgregarModal(true)}
                className="bg-blue-500 text-white px-2 py-2 rounded"
              >
                Agregar Componente
              </button>
            </div>
          ) : (
            <>
              <ComponentesTable
                sortedComponentes={sortedComponentes}
                editComponentId={editComponentId}
                editedComponent={editedComponent}
                handleEditClick={handleEditClick}
                handleInputChange={handleInputChange}
                handleSaveClick={handleSaveClick}
                handleCancelClick={handleCancelClick}
                handleDeleteComponente={handleDeleteComponente}
                abrirDocumento={abrirDocumento}
              />

              <div className="flex justify-center space-x-4 mt-4">
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
          onClose={handleTransferComplete}
        />
      )}

      {showTransferirMaquinaModal && (
        <TransferirMaquinaModal
          maquina={maquina}
          onClose={() => setShowTransferirMaquinaModal(false)}
        />
      )}
    </div>
  );
}

export default ModalMaquina;