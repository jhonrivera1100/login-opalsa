import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
const {logout} = useAuth();
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
              to="/GestionMaquinas"
              className="text-white text-sm font-bold transition duration-300 ease-in-out transform hover:text-blue-300 hover:text-lg hover:border-b-2 border-transparent"
            >
              Gestion de salas
            </Link>
            <Link
              to="/Historial"
              className="text-white text-sm font-bold transition duration-300 ease-in-out transform hover:text-blue-300 hover:text-lg hover:border-b-2 border-transparent"
            >
              Historial
            </Link>
            <Link
              to="/RegistroMantenimiento"
              className="text-white text-sm font-bold transition duration-300 ease-in-out transform hover:text-blue-300 hover:text-lg hover:border-b-2 border-transparent"
            >
              Mantenimientos
            </Link>
          </div>
          <div className="md:hidden">
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
              <div className="absolute top-20 right-0 mt-2 w-full bg-white rounded-md shadow-lg">
                <div className="py-1">
                  <Link
                    to="/GestionMaquinas"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Gestion de salas
                  </Link>
                  <Link
                    to="/Historial"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Historial
                  </Link>
                  <Link
                    to="/RegistroMantenimiento"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Mantenimientos
                  </Link>
                  <Link
                    to="/perfil"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Perfil
                  </Link>
                  <Link
                    to="/Admin"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Administrador
                  </Link>
                  <Link
                    to="/login"
                    onClick={() =>{
                      logout();
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                  >
                    Cerrar Sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
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
                <div className="absolute top-20 right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                    >
                      Perfil
                    </Link>
                    <Link
                      to="/Admin"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
                    >
                      Administrador
                    </Link>
                    <Link
                      to="/login"
                      onClick={() =>{
                        logout();
                      }}
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
      </div>
    </nav>
  );
}

export default Navbar;
