import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';

function ModalDocumentos({ isOpen, onClose, documentos }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <h2 className="text-2xl font-bold text-center bg-blue-800 text-white py-4">
          Documentación del Casino
        </h2>
        <div className="p-6">
          {documentos.length > 0 ? (
            <ul className="space-y-4">
              {documentos.map((doc, index) => (
                <li key={index} className="flex items-center">
                  <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 mr-2" />
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    Documentación legal {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-center">
              No hay documentos adjuntos a este casino.
            </p>
          )}
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
