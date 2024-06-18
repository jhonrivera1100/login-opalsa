import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, onClose }) => {
  const splitDescription = (description) => {
    const segments = [];
    for (let i = 0; i < description.length; i += 30) {
      segments.push(description.substring(i, i + 30));
    }
    return segments;
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="p-4">
          {children}
        </div>
        <button
          className="absolute top-0 right-0 p-2"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
