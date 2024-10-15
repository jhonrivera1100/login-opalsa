import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faChevronDown, faChevronUp, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useCasinos } from "../context/CasinosContext"; // Importamos el contexto

function ModalDocumentos({ isOpen, onClose, casinoId }) {
  const { getCasinoById, updateCasino, deleteDocument } = useCasinos(); // Usamos la función de obtención y actualización del contexto

  const [formData, setFormData] = useState({
    documents: [], // Aquí guardamos los archivos y sus categorías
  });

  const [currentDocuments, setCurrentDocuments] = useState(null); // Estado para los documentos actuales
  const [openSections, setOpenSections] = useState({
    documentacionLegal: false,
    usoDeSuelos: false,
    colJuegos: false,
    otrosDocumentos: false,
  });
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  // Efecto para obtener los datos del casino cada vez que se abre el modal
  useEffect(() => {
    if (isOpen && casinoId) {
      // Llama a la función para obtener los documentos más recientes del casino
      const fetchCasinoData = async () => {
        try {
          const response = await getCasinoById(casinoId);
          setCurrentDocuments(response.data); // Actualizar el estado con los datos del casino
        } catch (error) {
          console.error("Error al obtener los datos del casino:", error);
        }
      };
      fetchCasinoData();
    }
  }, [isOpen, casinoId, getCasinoById]);

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

  // Función para eliminar el documento
  const handleDeleteDocument = async (doc, category) => {
    try {
      await deleteDocument(casinoId, doc.public_id, category);
      // Actualizar el estado sin recargar la página
      setCurrentDocuments((prevDocuments) => ({
        ...prevDocuments,
        [category]: prevDocuments[category].filter((d) => d.public_id !== doc.public_id),
      }));
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

  // Función para enviar los documentos al servidor
  const handleSubmit = async () => {
    if (formData.documents.length === 0) {
      console.warn("No hay documentos para subir");
      return;
    }

    // Actualizar el estado de los documentos en el modal inmediatamente para reflejar los cambios sin latencia
    setCurrentDocuments((prevDocuments) => {
      const updatedDocuments = { ...prevDocuments };

      formData.documents.forEach((doc) => {
        if (doc.category && doc.file) {
          if (!updatedDocuments[doc.category]) {
            updatedDocuments[doc.category] = [];
          }
          updatedDocuments[doc.category].push({
            url: URL.createObjectURL(doc.file), // Utiliza URL temporal para vista previa
            public_id: `temp-${Math.random().toString(36).substr(2, 9)}`, // ID temporal
          });
        }
      });

      return updatedDocuments;
    });

    try {
      // Crear el FormData para enviar los archivos al servidor
      const formDataToSend = new FormData();
      formData.documents.forEach((doc, index) => {
        if (doc.file && doc.category) {
          formDataToSend.append(`documents[${index}][file]`, doc.file);
          formDataToSend.append(`documents[${index}][category]`, doc.category);
        }
      });

      // Realizar la petición al backend para subir los documentos
      const response = await updateCasino(casinoId, formDataToSend);

      // Si la subida fue exitosa, reemplazar los IDs temporales con los reales del servidor
      if (response && response.data) {
        setCurrentDocuments(response.data); // Actualizar el estado con los datos reales desde la base de datos
        setSuccessMessage("Documento añadido con éxito");
        setTimeout(() => {
          setSuccessMessage(""); // Borrar el mensaje después de 3 segundos
        }, 3000);
      } else {
        console.error("No se pudo actualizar los documentos en el servidor.");
      }
    } catch (error) {
      console.error("Error al actualizar el casino con nuevos documentos:", error);
      alert("Hubo un error al subir los documentos. Por favor, intente nuevamente.");
    } finally {
      // Limpiar el formulario después de intentar subir
      setFormData({ documents: [] });
    }
  };

  const renderDocumentos = (titulo, listaDocumentos, categoria) => {
    return (
      <div>
        <h3
          className="font-bold text-lg flex items-center cursor-pointer"
          onClick={() => toggleSection(categoria)}
        >
          {titulo}
          <FontAwesomeIcon
            icon={openSections[categoria] ? faChevronUp : faChevronDown}
            className="ml-2"
          />
        </h3>
        {openSections[categoria] && listaDocumentos && listaDocumentos.length > 0 ? (
          <ul className="space-y-2 pl-4">
            {listaDocumentos.map((doc, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 mr-2" />
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Documento {index + 1}
                  </a>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 ml-4"
                  onClick={() => handleDeleteDocument(doc, categoria)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          openSections[categoria] && <p className="text-gray-700">No hay documentos en {titulo}.</p>
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
          {successMessage && (
            <div className="p-2 text-center bg-green-200 text-green-800 rounded-md">
              {successMessage}
            </div>
          )}

          {currentDocuments ? (
            <>
              {renderDocumentos("Documentación Legal", currentDocuments.documentacionLegal || [], "documentacionLegal")}
              {renderDocumentos("Uso de Suelos", currentDocuments.usoDeSuelos || [], "usoDeSuelos")}
              {renderDocumentos("ColJuegos", currentDocuments.colJuegos || [], "colJuegos")}
              {renderDocumentos("Otros Documentos", currentDocuments.otrosDocumentos || [], "otrosDocumentos")}
            </>
          ) : (
            <p>Cargando documentos...</p>
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
                  <option value="documentacionLegal">Documentación Legal</option>
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
