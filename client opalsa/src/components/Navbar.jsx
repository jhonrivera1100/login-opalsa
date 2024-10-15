import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCog,
  FaHistory,
  FaTools,
  FaUser,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AiFillContainer } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // Usamos el hook useNavigate

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

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

  const handleNavigate = (path) => {
    navigate(path);
    closeMenu(); // Cerrar el menú si está abierto en vista móvil
  };

  const renderLink = (to, icon, label) => (
    <div
      onClick={() => handleNavigate(to)}
      className={getLinkClass(to)}
      style={{ cursor: "pointer" }}
    >
      <div className={getLineClass(to)}></div>
      <div className={getIconBgClass(to)}>{icon}</div>
      {isHovered && (
        <span className="ml-2 text-gray-700 group-hover:text-blue-800">
          {label}
        </span>
      )}
    </div>
  );

  const adminLinks = (
    <>
      {renderLink("/GestionMaquinas", <FaCog className={getIconClass("/GestionMaquinas")} />, "Gestión")}
      {renderLink("/Historial", <FaHistory className={getIconClass("/Historial")} />, "Historial")}
      {renderLink("/RegistroMantenimiento", <FaTools className={getIconClass("/RegistroMantenimiento")} />, "Reportes")}
      {renderLink("/profile", <FaUser className={getIconClass("/profile")} />, "Perfil")}
      {renderLink("/admin", <FaUserShield className={getIconClass("/admin")} />, "Administrador")}
      {renderLink("/RespuestasOrden", <AiFillContainer className={getIconClass("/RespuestasOrden")} />, "Mis Ordenes")}
    </>
  );

  const userLinks = (
    <>
      {renderLink("/", <FaHome className={getIconClass("/")} />, "Inicio")}
      {renderLink("/RegistroMantenimiento", <FaTools className={getIconClass("/RegistroMantenimiento")} />, "Reportes")}
      {renderLink("/profile", <FaUser className={getIconClass("/profile")} />, "Perfil")}
      {renderLink("/RespuestasOrden", <AiFillContainer className={getIconClass("/RespuestasOrden")} />, "Mis Ordenes")}
    </>
  );

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed bottom-4 right-4 z-50 p-4 bg-blue-950 text-white rounded-full md:hidden focus:outline-none"
      >
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      <nav
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-slate-200 font-semibold font-poppins text-zinc-900 md:w-30`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col h-full">
          <div className="bg-blue-950 text-white py-12 px-4 flex flex-col justify-center items-center">
            {isHovered ? (
              <span className="text-base font-bold mb-2">OPALSA SAS</span>
            ) : (
              <span
                className={`text-base font-bold ${
                  isHovered ? "" : "justify-center"
                } mb-2`}
              >
                OPALSA
              </span>
            )}
          </div>
          <div className="flex flex-col flex-grow p-4 space-y-2">
            {role === "admin" ? adminLinks : userLinks}
            <div className="flex-grow"></div>
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
      </nav>
    </>
  );
}

export default Navbar;
