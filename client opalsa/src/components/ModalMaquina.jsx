import React, { useState, useEffect } from "react";
import {
  updateComponentesRequest,
  deleteComponentesRequest,
  uploadComponenteImageRequest,
} from "../api/componentes";
import { useComponentes } from "../context/ComponentesContext";
import AgregarComponenteModal from "./AgregarComponenteModal";
import TransferirComponenteModal from "./TransferirComponenteModal";
import TransferirMaquinaModal from "./TransferirMaquinaModal"; 
import ComponentesTable from "./ComponentesTable";
import CardMaquinaModal from "./CardMaquinaModal";
import { deleteMaquinasRequest, updateMaquinasRequest } from "../api/maquinas";

function ModalMaquina({ maquina, onClose }) {
  const { componentes, getComponentes, pagination, loading } = useComponentes();
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showTransferirModal, setShowTransferirModal] = useState(false);
  const [showTransferirMaquinaModal, setShowTransferirMaquinaModal] = useState(false);
  const [estadoMaquina, setEstadoMaquina] = useState(maquina.estadoMaquina);
  const [maquinaData, setMaquinaData] = useState(maquina); // Estado local de la máquina
  const [editComponentId, setEditComponentId] = useState(null);
  const [editedComponent, setEditedComponent] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Página actual

  // Cargar componentes cuando el modal se monta o cuando la página cambia
  useEffect(() => {
    getComponentes(maquina._id, currentPage);
  }, [maquina._id, currentPage]);

  // Cambiar de página en la tabla de componentes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTransferComplete = () => {
    getComponentes(maquina._id, currentPage);
    setShowTransferirModal(false);
  };

  const handleDeleteComponente = async (componenteId) => {
    try {
      await deleteComponentesRequest(componenteId);
      getComponentes(maquina._id, currentPage); 
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
      getComponentes(maquina._id, currentPage); 
      setEditComponentId(null);
    } catch (error) {
      console.error("Error al actualizar el componente:", error);
    }
  };

  const handleCancelClick = () => {
    setEditComponentId(null);
  };

  const handleEliminarMaquina = async () => {
    try {
      await deleteMaquinasRequest(maquina._id);
      onClose();
      window.location.reload(); // Recarga la página para actualizar la lista de máquinas
    } catch (error) {
      console.error("Error al eliminar la máquina:", error);
    }
  };
  
  

  const abrirDocumento = (url) => {
    window.open(url, "_blank");
  };

  const handleImageUpload = async (componenteId, file) => {
    try {
      const formData = new FormData();
      formData.append("imagenComponente", file);

      await uploadComponenteImageRequest(componenteId, formData);
      getComponentes(maquina._id, currentPage);
    } catch (error) {
      console.error("Error al subir la imagen del componente:", error);
    }
  };

  const updateMaquina = async (editedMaquina) => {
    try {
      const updatedMaquina = await updateMaquinasRequest(maquina._id, editedMaquina);
      setMaquinaData(updatedMaquina.data); // Actualiza el estado local con la máquina actualizada
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
          maquina={maquinaData} // Pasa el estado actualizado de la máquina
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
          {componentes.length === 0 && !loading ? (
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
                sortedComponentes={componentes}
                editComponentId={editComponentId}
                editedComponent={editedComponent}
                handleEditClick={handleEditClick}
                handleInputChange={handleInputChange}
                handleSaveClick={handleSaveClick}
                handleCancelClick={handleCancelClick}
                handleDeleteComponente={handleDeleteComponente}
                abrirDocumento={abrirDocumento}
                handleImageUpload={handleImageUpload}
              />

              {/* Controles de paginación */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`mx-1 px-4 py-2 rounded-md ${
                        pagination.currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}

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