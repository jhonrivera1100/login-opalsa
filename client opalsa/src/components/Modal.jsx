import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-md z-10 shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Modal;
