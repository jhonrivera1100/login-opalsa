import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav style={{ backgroundColor: "#1a202c" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="hidden md:flex flex-grow items-center justify-center space-x-4">
            <Link
              to="/"
              className="text-white text-sm font-bold transition duration-300 ease-in-out transform hover:text-blue-300 hover:text-lg hover:border-b-2 border-transparent"
            >
              Gestion de salas
            </Link>
            <Link
              to="/about"
              className="text-white text-sm font-bold transition duration-300 ease-in-out transform hover:text-blue-300 hover:text-lg hover:border-b-2 border-transparent"
            >
              Registros
            </Link>
            <Link
              to="/contact"
              className="text-white text-sm font-bold transition duration-300 ease-in-out transform hover:text-blue-300 hover:text-lg hover:border-b-2 border-transparent"
            >
              Mantenimientos
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white text-sm font-bold focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                <div className="py-1">
                  <Link
                    to="/perfil"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Administrador
                  </Link>
                  <Link
                    to="/cerrar-sesion"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Cerrar Sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
