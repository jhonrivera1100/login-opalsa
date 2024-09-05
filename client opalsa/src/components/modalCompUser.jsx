// ModalComponentes.js
import React from 'react';

const ModalComponentes = ({ orden, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Componentes Asignados</h2>
        <ul className="space-y-2">
          {orden.componentes.map((componente, index) => (
            <li key={`${componente.serialComponente}-${index}`}>
              {componente.nombreComponente} <br /> (Serial: {componente.serialComponente})
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalComponentes;
