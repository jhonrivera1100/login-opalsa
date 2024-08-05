import React from "react";
import ReactDOM from "react-dom";
import { IoClose } from "react-icons/io5";

const Modal = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <IoClose size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
