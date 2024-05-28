import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCog, FaHistory, FaTools, FaUser, FaUserShield, FaSignOutAlt, FaHome } from 'react-icons/fa';

function Navbar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 h-full transition-all duration-300 ${
        isHovered ? "w-55" : "w-20"
      } bg-black text-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Parte superior con texto OPALSA */}
        <div className="bg-blue-500 text-white py-6 px-4 flex flex-col justify-center items-center">
          {isHovered ? (
            <span className="text-lg font-bold mb-2">OPALSA</span>
          ) : (
            <span className={`text-lg font-bold ${isHovered ? "" : "justify-center"} mb-2`}>®️</span>
          )}
        </div>
        {/* Links del menú */}
        <div className="flex flex-col flex-grow p-4 space-y-2">
          <Link to="/" className="flex items-center text-md transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white p-2 rounded">
            <FaHome className="h-6 w-6 mr-1" />
            {isHovered && <span>Inicio</span>}
          </Link>
          <Link
            to="/GestionMaquinas"
            className="flex items-center text-md transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white p-2 rounded"
          >
            <FaCog className="h-6 w-6 mr-1" />
            {isHovered && <span>Gestión</span>}
          </Link>
          <Link
            to="/Historial"
            className="flex items-center text-md transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white p-2 rounded"
          >
            <FaHistory className="h-6 w-6 mr-1" />
            {isHovered && <span>Historial</span>}
          </Link>
          <Link
            to="/RegistroMantenimiento"
            className="flex items-center text-md transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white p-2 rounded"
          >
            <FaTools className="h-6 w-6 mr-1" />
            {isHovered && <span>Mantenimientos</span>}
          </Link>
          <Link
            to="/profile"
            className="flex items-center text-md transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white p-2 rounded"
          >
            <FaUser className="h-6 w-6 mr-1" />
            {isHovered && <span>Perfil</span>}
          </Link>
          <Link
            to="/admin"
            className="flex items-center text-md transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white p-2 rounded"
          >
            <FaUserShield className="h-6 w-6 mr-1" />
            {isHovered && <span>Administrador</span>}
          </Link>
          <div className="flex-grow"></div> {/* Elemento de separación */}
          <Link
            to="/cerrar-sesion"
            className="flex items-center text-md transition duration-300 ease-in-out transform hover:bg-gray-800 hover:text-white p-2 rounded"
          >
            <FaSignOutAlt className="h-6 w-6 mr-1" />
            {isHovered && <span>Cerrar Sesión</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
