import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useElementos } from "../context/ElementosContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faEdit, faSave, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement("#root");

const ElementsModal = ({ isOpen, onRequestClose, casinoId }) => {
  const { getElementosByCasino, elementos, updateElemento, deleteElemento } = useElementos();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

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
      codigoElemento: elemento.codigoElemento, // Nuevo campo
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
    if (window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      deleteElemento(id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Elementos Modal"
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="relative bg-white p-4 rounded-lg w-full max-w-5xl h-3/4 overflow-y-auto">
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
        <h2 className="text-2xl text-center text-slate-500 font-bold mb-4">Elementos en el Casino</h2>
        <div className="w-full">
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
                            <button onClick={() => handleSave(elemento)}>
                              <FontAwesomeIcon
                                icon={faSave}
                                className="text-blue-600 text-lg cursor-pointer"
                              />
                            </button>
                          ) : (
                            <button onClick={() => handleEdit(elemento)}>
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="text-blue-600 text-lg cursor-pointer"
                              />
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <button onClick={() => handleDelete(elemento._id)}>
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="text-red-600 text-lg cursor-pointer"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-sm font-medium text-gray-500 py-4"
                      >
                        No se encontraron elementos en este casino.
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
  );
};

export default ElementsModal;
