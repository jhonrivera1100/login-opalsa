import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { useCasinos } from "../context/CasinosContext"; // Importamos el contexto

function ModalDocumentos({ isOpen, onClose, documentos, casinoId }) {
  const { updateCasino } = useCasinos(); // Usamos la función de actualización del contexto

  const [formData, setFormData] = useState({
    documents: [], // Aquí guardamos los archivos y sus categorías
  });

  const [openSections, setOpenSections] = useState({
    documentacionLegal: false,
    usoDeSuelos: false,
    colJuegos: false,
    otrosDocumentos: false,
  });

  if (!isOpen) return null; // Garantiza que el modal no se renderice hasta que se solicite abrir

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Añadir un nuevo campo para documentos dinámicamente
  const addDocumentField = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { file: null, category: "" }],
    });
  };

  // Maneja cambios en cada documento dinámico
  const handleDocumentChange = (index, event) => {
    const { name, value, files } = event.target;
    const updatedDocuments = [...formData.documents];

    if (name === "file") {
      updatedDocuments[index].file = files[0]; // Añade el archivo seleccionado
    } else {
      updatedDocuments[index].category = value; // Añade la categoría seleccionada
    }

    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  // Remover un campo de documento
  const removeDocumentField = (index) => {
    const updatedDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  // Enviar los documentos adicionales para el casino ya existente
  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Añadir los archivos con sus categorías específicas
    formData.documents.forEach((doc, index) => {
      if (doc.file && doc.category) {
        formDataToSend.append(`documents[${index}][file]`, doc.file);
        formDataToSend.append(`documents[${index}][category]`, doc.category);
      }
    });

    try {
      // Llamada al método de actualización desde el contexto
      await updateCasino(casinoId, formDataToSend);
      window.location.reload(); // Recargar la página después de subir documentos
    } catch (error) {
      console.error(
        "Error al actualizar el casino con nuevos documentos:",
        error
      );
    }
  };

  const renderDocumentos = (titulo, listaDocumentos) => {
    return (
      <div>
        <h3
          className="font-bold text-lg flex items-center cursor-pointer"
          onClick={() => toggleSection(titulo)}
        >
          {titulo}
          <FontAwesomeIcon
            icon={openSections[titulo] ? faChevronUp : faChevronDown}
            className="ml-2"
          />
        </h3>
        {openSections[titulo] &&
        listaDocumentos &&
        listaDocumentos.length > 0 ? (
          <ul className="space-y-2 pl-4">
            {listaDocumentos.map((doc, index) => (
              <li key={index} className="flex items-center">
                <FontAwesomeIcon
                  icon={faFileAlt}
                  className="text-blue-500 mr-2"
                />
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Documento {index + 1}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          openSections[titulo] && (
            <p className="text-gray-700">No hay documentos en {titulo}.</p>
          )
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <h2 className="text-2xl font-bold text-center bg-blue-800 text-white py-4">
          Documentación del Casino
        </h2>
        <div className="p-6 space-y-4">
          {/* Mostrar documentos existentes o mensajes si no hay documentos */}
          {renderDocumentos(
            "Documentación Legal",
            documentos.documentacionLegal || []
          )}
          {renderDocumentos("Uso de Suelos", documentos.usoDeSuelos || [])}
          {renderDocumentos("ColJuegos", documentos.colJuegos || [])}
          {renderDocumentos(
            "Otros Documentos",
            documentos.otrosDocumentos || []
          )}

          {/* Campos dinámicos para subir nuevos documentos */}
          <div className="space-y-4">
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex gap-4 items-center mb-4">
                <select
                  name="category"
                  value={doc.category}
                  onChange={(e) => handleDocumentChange(index, e)}
                  className="border border-gray-300 rounded-md py-2 px-4 w-1/3 text-black"
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="documentacionLegal">
                    Documentación Legal
                  </option>
                  <option value="usoDeSuelos">Uso de Suelos</option>
                  <option value="colJuegos">ColJuegos</option>
                  <option value="otrosDocumentos">Otros Documentos</option>
                </select>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => handleDocumentChange(index, e)}
                  className="border border-gray-300 rounded-md py-2 px-4 w-1/3 text-black"
                />
                <button
                  type="button"
                  onClick={() => removeDocumentField(index)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDocumentField}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Añadir Documento
            </button>
          </div>

          <button
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full"
            onClick={handleSubmit}
          >
            Guardar Documentos
          </button>
          <button
            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-full"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDocumentos;
