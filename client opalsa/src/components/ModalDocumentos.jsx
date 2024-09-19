import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

function ModalDocumentos({ isOpen, onClose, documentos }) {
  if (!isOpen) return null;

  const {
    documentacionLegal = [],
    usoDeSuelos = [],
    colJuegos = [],
    otrosDocumentos = []
  } = documentos || {};

  const [openSections, setOpenSections] = useState({
    documentacionLegal: false,
    usoDeSuelos: false,
    colJuegos: false,
    otrosDocumentos: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderDocumentos = (titulo, listaDocumentos) => {
    return (
      <div>
        <h3 className="font-bold text-lg flex items-center cursor-pointer" onClick={() => toggleSection(titulo)}>
          {titulo}
          <FontAwesomeIcon icon={openSections[titulo] ? faChevronUp : faChevronDown} className="ml-2" />
        </h3>
        {openSections[titulo] && listaDocumentos.length > 0 && (
          <ul className="space-y-2 pl-4">
            {listaDocumentos.map((doc, index) => (
              <li key={doc._id} className="flex items-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 mr-2" />
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Documento {index + 1} {/* Cambiado a "Documento 1", "Documento 2", etc. */}
                </a>
              </li>
            ))}
          </ul>
        )}
        {openSections[titulo] && listaDocumentos.length === 0 && (
          <p className="text-gray-700">No hay documentos en {titulo}.</p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <h2 className="text-2xl font-bold text-center bg-blue-800 text-white py-4">
          Documentación del Casino
        </h2>
        <div className="p-6 space-y-4">
          {renderDocumentos('Documentación Legal', documentacionLegal)}
          {renderDocumentos('Uso de Suelos', usoDeSuelos)}
          {renderDocumentos('ColJuegos', colJuegos)}
          {renderDocumentos('Otros Documentos', otrosDocumentos)}

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
