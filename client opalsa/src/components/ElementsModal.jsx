import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useElementos } from "../context/ElementosContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";

Modal.setAppElement('#root'); // Establece el elemento raíz para la accesibilidad

const ElementsModal = ({ isOpen, onRequestClose, casinoId }) => {
  const { getElementosByCasino, elementos } = useElementos();
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (isOpen && casinoId) {
      if (!hasFetched) {
        setIsLoading(true);
        getElementosByCasino(casinoId)
          .then(() => {
            setIsLoading(false);
            setHasFetched(true); // Marca que los datos ya han sido obtenidos
          })
          .catch(() => {
            setIsLoading(false);
            setHasFetched(false); // Resetea si ocurre un error
          });
      }
    } else {
      setHasFetched(false); // Resetea el estado cuando se cierra el modal
    }
  }, [isOpen, casinoId, getElementosByCasino, hasFetched]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Elementos Modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="relative bg-white p-4 rounded-lg w-3/4 max-w-4xl">
        {/* Botón para cerrar el modal */}
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
        <h2 className="text-2xl text-center font-bold mb-4">Elementos en el Casino</h2>
        <div className="w-full">
          {isLoading ? (
            <p className="text-center">Cargando...</p>
          ) : (
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
                  <th className="px-6 py-3 text-center text-sm font-medium text-blue-600 uppercase tracking-wider">
                    Documentación
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {elementos.length > 0 ? (
                  elementos.map((elemento) => (
                    <tr key={elemento._id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        {elemento.imgElemento && elemento.imgElemento.url ? (
                          <img
                            src={elemento.imgElemento.url}
                            alt={elemento.nombreElemento}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          "No Disponible"
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        {elemento.nombreElemento}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {elemento.marcaElemento}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {elemento.tipoElemento}
                      </td>
                      <td className="px-6 py-3 text-sm ml-19 text-center text-gray-500">
                        {elemento.documentacionElemento && elemento.documentacionElemento.length > 0 && elemento.documentacionElemento[0].url ? (
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
                          "No Disponible"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-3 text-center" colSpan="5">
                      No se encontraron elementos para este casino.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ElementsModal;
