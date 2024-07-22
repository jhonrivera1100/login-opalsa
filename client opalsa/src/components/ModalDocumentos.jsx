import React from 'react';

function ModalDocumentos({ isOpen, onClose, documentos }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Documentación del Casino</h2>
        <ul className="space-y-2">
          {documentos.map((doc, index) => (
            <li key={index}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Documentacion legal {index + 1}
              </a>
            </li>
          ))}
        </ul>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={onClose}
        >
          Cerrar
        </button>
        .
      </div>
    </div>
  );
}

export default ModalDocumentos;
