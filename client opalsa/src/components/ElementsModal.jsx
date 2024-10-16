import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useElementos } from "../context/ElementosContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faEdit, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TransferModal from "./TransferModal"; // Importa el nuevo modal

Modal.setAppElement("#root");

const ElementsModal = ({ isOpen, onRequestClose, casinoId }) => {
  const { getElementosByCasino, elementos, updateElemento, deleteElemento } = useElementos();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [elementToTransfer, setElementToTransfer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [elementToDelete, setElementToDelete] = useState(null);

  useEffect(() => {
    if (isOpen && casinoId) {
      if (!hasFetched) {
        setIsLoading(true);
        getElementosByCasino(casinoId)
          .then(() => {
            setIsLoading(false);
            setHasFetched(true);
          })
          .catch(() => {
            setIsLoading(false);
            setHasFetched(false);
          });
      }
    } else {
      setHasFetched(false);
    }
  }, [isOpen, casinoId, getElementosByCasino, hasFetched]);

  const handleMouseEnter = (imgUrl) => {
    setZoomedImage(imgUrl);
  };

  const handleMouseLeave = () => {
    setZoomedImage(null);
  };

  const handleEdit = (elemento) => {
    setEditingId(elemento._id);
    setEditedData({
      nombreElemento: elemento.nombreElemento,
      marcaElemento: elemento.marcaElemento,
      tipoElemento: elemento.tipoElemento,
      codigoElemento: elemento.codigoElemento,
    });
  };

  const handleSave = (elemento) => {
    updateElemento({ ...elemento, ...editedData });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    setElementToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteElemento(elementToDelete);
    setIsDeleteModalOpen(false);
    setElementToDelete(null);
  };

  const handleOpenTransferModal = (elemento) => {
    setElementToTransfer(elemento);
    setIsTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setElementToDelete(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Elementos Modal"
        className="fixed inset-0 flex items-center justify-center z-50 font-poppins"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
      >
        <div className="relative bg-white p-4 rounded-lg w-full max-w-6xl h-3/4 overflow-y-auto">
          <button
            onClick={onRequestClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-2xl text-center text-slate-500 font-bold mb-4">
            Elementos en el Casino
          </h2>
          <div className="w-full relative">
            {isLoading ? (
              <p className="text-center">Cargando...</p>
            ) : (
              <div className="relative">
                <table className="min-w-full bg-gray-50 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Imagen
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Marca
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Documentación
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Editar
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Eliminar
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">
                        Transferir
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {elementos.length > 0 ? (
                      elementos.map((elemento) => (
                        <tr key={elemento._id} className="hover:bg-gray-50">
                          <td
                            className="px-6 py-3 text-sm font-medium text-gray-900"
                            onMouseEnter={() => handleMouseEnter(elemento.imgElemento?.url)}
                            onMouseLeave={handleMouseLeave}
                          >
                            {elemento.imgElemento?.url ? (
                              <img
                                src={elemento.imgElemento.url}
                                alt={elemento.nombreElemento}
                                className="w-12 h-12 object-cover rounded cursor-pointer transform transition duration-200 hover:scale-125"
                              />
                            ) : (
                              "No Disponible"
                            )}
                          </td>
                          <td className="px-6 py-3 text-sm font-medium text-gray-900">
                            {editingId === elemento._id ? (
                              <input
                                type="text"
                                name="nombreElemento"
                                value={editedData.nombreElemento}
                                onChange={handleChange}
                                className="w-full border-b-2 focus:outline-none focus:border-blue-600"
                              />
                            ) : (
                              elemento.nombreElemento
                            )}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500">
                            {editingId === elemento._id ? (
                              <input
                                type="text"
                                name="marcaElemento"
                                value={editedData.marcaElemento}
                                onChange={handleChange}
                                className="w-full border-b-2 focus:outline-none focus:border-blue-600"
                              />
                            ) : (
                              elemento.marcaElemento
                            )}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500">
                            {editingId === elemento._id ? (
                              <input
                                type="text"
                                name="tipoElemento"
                                value={editedData.tipoElemento}
                                onChange={handleChange}
                                className="w-full border-b-2 focus:outline-none focus:border-blue-600"
                              />
                            ) : (
                              elemento.tipoElemento
                            )}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-500">
                            {editingId === elemento._id ? (
                              <input
                                type="text"
                                name="codigoElemento"
                                value={editedData.codigoElemento}
                                onChange={handleChange}
                                className="w-full border-b-2 focus:outline-none focus:border-blue-600"
                              />
                            ) : (
                              elemento.codigoElemento
                            )}
                          </td>
                          <td className="px-6 py-3 text-center text-sm text-gray-500">
                            <div className="flex justify-center items-center h-12">
                              {elemento.documentacionElemento?.[0]?.url ? (
                                <a
                                  href={elemento.documentacionElemento[0].url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FontAwesomeIcon
                                    icon={faFileAlt}
                                    className="text-blue-600 text-3xl"
                                  />
                                </a>
                              ) : (
                                <span className="text-sm text-gray-500">Sin Documento</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            {editingId === elemento._id ? (
                              <button
                                onClick={() => handleSave(elemento)}
                                className="text-green-600 text-xl"
                              >
                                <FontAwesomeIcon icon={faSave} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEdit(elemento)}
                                className="text-yellow-600 text-xl"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => handleDelete(elemento._id)}
                              className="text-red-600 text-xl"
                            >
                              <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => handleOpenTransferModal(elemento)}
                              className="text-blue-600 text-xl"
                            >
                              Transferir
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-6 py-3 text-center text-gray-500"
                        >
                          No hay elementos registrados en este casino.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {zoomedImage && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-75 p-2 rounded-lg">
                    <img
                      src={zoomedImage}
                      alt="Zoomed"
                      className="max-w-xs max-h-xs object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de eliminación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={handleCloseDeleteModal}
        contentLabel="Confirmar eliminación"
        className="fixed inset-0 flex items-center justify-center z-50 font-poppins"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
      >
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">¿Deseas eliminar este elemento?</h3>
          <div className="flex justify-end gap-4">
            <button
              onClick={handleCloseDeleteModal}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de transferencia */}
      {isTransferModalOpen && elementToTransfer && (
        <TransferModal
          onClose={handleCloseTransferModal}
          elemento={elementToTransfer}
        />
      )}
    </>
  );
};

export default ElementsModal;
