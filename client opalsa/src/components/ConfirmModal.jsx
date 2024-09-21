import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white shadow-2xl rounded-lg p-8 w-[400px] transform transition-all ease-out duration-300 scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Confirmación</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
