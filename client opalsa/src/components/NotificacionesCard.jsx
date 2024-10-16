import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { GoDiscussionClosed } from "react-icons/go";
import { useAuth } from "../context/AuthContext";
import Modal from './Modal';

const NotificacionesCard = ({
  recordatorio,
  handleCheckboxChange,
  handleDelete,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleDescriptionClick = (descripcion) => {
    setModalContent(descripcion);
    setModalTitle(""); // Limpia el título para mostrar solo la descripción
    setIsModalOpen(true);
  };

  const handleTitleClick = (titulo) => {
    setModalTitle(titulo);
    setModalContent(""); // Limpia la descripción para mostrar solo el título
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(""); 
    setModalTitle(""); 
  };

  // Función para abrir el archivo
  const handleOpenFile = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <div
      key={recordatorio._id}
      className={`relative py-6 px-6 rounded-3xl w-[250px] my-4 shadow-xl ${
        recordatorio.visto ? "bg-green-100" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-end space-x-2 mb-4">
        <input
          type="checkbox"
          checked={recordatorio.visto}
          onChange={() =>
            handleCheckboxChange(recordatorio._id, recordatorio.visto)
          }
          className="form-checkbox h-5 w-5 text-green-600"
        />
        <label className="text-gray-600">Visto</label>
      </div>
      <div className="text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-orange-500 left-4 -top-4">
        <GoDiscussionClosed className="w-8 h-8" />
      </div>
      <div>
        <p className="text-xl font-semibold mb-2">Recordatorio</p>
        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
          <FaRegUser className="h-5 w-5" />
          <p>
            {recordatorio.usuario
              ? recordatorio.usuario.username
              : "Desconocido"}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>
            {new Date(
              new Date(recordatorio.fechaRecordatorio).getTime() +
                new Date(recordatorio.fechaRecordatorio).getTimezoneOffset() *
                  60000
            ).toLocaleDateString()}
          </p>
        </div>
        <div className="border-t-2 border-gray-200 mt-3 mb-4"></div>
        <p
          className="text-gray-600 mb-2 cursor-pointer"
          onClick={() => handleTitleClick(recordatorio.titulo)}
        >
          <strong>Título:</strong>{" "}
          {recordatorio.titulo.length > 10
            ? `${recordatorio.titulo.substring(0, 15)}...`
            : recordatorio.titulo}
        </p>
        <p
          className="text-gray-600 mb-2 cursor-pointer"
          onClick={() => handleDescriptionClick(recordatorio.descripcion)}
        >
          <strong>Descripción:</strong>{" "}
          {recordatorio.descripcion.length > 10
            ? `${recordatorio.descripcion.substring(0, 40)}...`
            : recordatorio.descripcion}
        </p>
        <div className="flex justify-between mt-[60px]">
          <button
            className="bg-red-500 text-white py-1 px-4 mr-3 rounded-md hover:bg-red-700 transition duration-300"
            onClick={() => handleDelete(recordatorio._id, "recordatorio")}
          >
            Eliminar
          </button>
          {recordatorio.documentoRecordatorio.length > 0 && (
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              onClick={() =>
                handleOpenFile(recordatorio.documentoRecordatorio[0].url)
              }
            >
              Ver Archivo
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-lg font-semibold mb-4">Titulo Completo</h2>
          {modalTitle && <p>{modalTitle}</p>}
          {modalContent && <p><strong>Descripción:</strong> {modalContent}</p>}
          <button
            className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition duration-300"
            onClick={handleCloseModal}
          >
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
};

export default NotificacionesCard;
