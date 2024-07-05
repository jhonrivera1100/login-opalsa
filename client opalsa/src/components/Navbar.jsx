import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCog,
  FaHistory,
  FaTools,
  FaUser,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `group flex items-center text-base transition duration-300 ease-in-out transform p-2 rounded-tr-3xl rounded-br-3xl relative ${
      isActive ? "bg-white text-blue-800" : "hover:bg-white hover:text-blue-800"
    }`;
  };

  const getIconBgClass = (path) => {
    const isActive = location.pathname === path;
    return `rounded-full p-2 transition duration-300 ${
      isActive ? "bg-slate-200" : "bg-white group-hover:bg-slate-200"
    }`;
  };

  const getIconClass = (path) => {
    const isActive = location.pathname === path;
    return `h-5 w-5 transition duration-300 ${
      isActive ? "text-blue-800" : "text-gray-700 group-hover:text-blue-800"
    }`;
  };

  const getLineClass = (path) => {
    const isActive = location.pathname === path;
    const excludePaths = ["/admin", "/logout"];
    if (excludePaths.includes(path)) {
      return "absolute left-0 top-0 bottom-0 w-1 bg-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300";
    }
    return `absolute left-0 top-0 bottom-0 w-1 bg-blue-800 transition-opacity duration-300 ${
      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
        isHovered ? "w-55" : "w-30"
      } bg-slate-200 font-semibold text-zinc-900`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Parte superior con texto OPALSA */}
        <div className="bg-blue-950 text-white py-12 px-4 flex flex-col justify-center items-center">
          {isHovered ? (
            <span className="text-base font-bold mb-2">OPALSA</span>
          ) : (
            <span
              className={`text-base font-bold ${
                isHovered ? "" : "justify-center"
              } mb-2`}
            >
              |
            </span>
          )}
        </div>
        {/* Links del menú */}
        <div className="flex flex-col flex-grow p-4 space-y-2">
          <Link to="/" className={getLinkClass("/")}>
            <div className={getLineClass("/")}></div>
            <div className={getIconBgClass("/")}>
              <FaHome className={getIconClass("/")} />
            </div>
            {isHovered && (
              <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                Inicio
              </span>
            )}
          </Link>
          <Link
            to="/GestionMaquinas"
            className={getLinkClass("/GestionMaquinas")}
          >
            <div className={getLineClass("/GestionMaquinas")}></div>
            <div className={getIconBgClass("/GestionMaquinas")}>
              <FaCog className={getIconClass("/GestionMaquinas")} />
            </div>
            {isHovered && (
              <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                Gestión
              </span>
            )}
          </Link>
          <Link to="/Historial" className={getLinkClass("/Historial")}>
            <div className={getLineClass("/Historial")}></div>
            <div className={getIconBgClass("/Historial")}>
              <FaHistory className={getIconClass("/Historial")} />
            </div>
            {isHovered && (
              <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                Historial
              </span>
            )}
          </Link>
          <Link
            to="/RegistroMantenimiento"
            className={getLinkClass("/RegistroMantenimiento")}
          >
            <div className={getLineClass("/RegistroMantenimiento")}></div>
            <div className={getIconBgClass("/RegistroMantenimiento")}>
              <FaTools className={getIconClass("/RegistroMantenimiento")} />
            </div>
            {isHovered && (
              <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                Reportes
              </span>
            )}
          </Link>
          <Link to="/profile" className={getLinkClass("/profile")}>
            <div className={getLineClass("/profile")}></div>
            <div className={getIconBgClass("/profile")}>
              <FaUser className={getIconClass("/profile")} />
            </div>
            {isHovered && (
              <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                Perfil
              </span>
            )}
          </Link>
          <div className="flex-grow"></div>
          <div
            className={`flex flex-col ${
              menuOpen ? "block" : "hidden"
            } md:hidden`}
          >
            <Link
              to="/login"
              onClick={logout}
              className={getLinkClass("/login")}
            >
              <div className={getLineClass("/login")}></div>
              <div className={getIconBgClass("/login")}>
                <FaSignOutAlt className={getIconClass("/login")} />
              </div>
              {isHovered && (
                <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                  Cerrar Sesión
                </span>
              )}
            </Link>
          </div>
          <div
            className={`hidden md:flex flex-col space-y-2 ${
              menuOpen ? "block" : "hidden"
            }`}
          >
            <Link to="/admin" className={getLinkClass("/admin")}>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-white group-hover:bg-slate-200 rounded-full p-2 transition duration-300">
                <FaUserShield className={getIconClass("/admin")} />
              </div>
              {isHovered && (
                <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                  Administrador
                </span>
              )}
            </Link>
            <div
              onClick={logout}
              className="group flex items-center text-base transition duration-300 ease-in-out transform hover:bg-white hover:text-blue-800 p-2 rounded-tr-3xl rounded-br-3xl relative cursor-pointer"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-white group-hover:bg-slate-200 rounded-full p-2 transition duration-300">
                <FaSignOutAlt className={getIconClass("/logout")} />
              </div>
              {isHovered && (
                <span className="ml-2 text-gray-700 group-hover:text-blue-800">
                  Cerrar Sesión
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
