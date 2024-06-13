import React from 'react';
import { FaBell, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function UserHeader() {
  const { user } = useAuth();

  // Obtener el primer nombre del usuario
  const firstName = user?.username?.split(' ')[0] || '';

  return (
    <div className="bg-slate-200 p-1 flex justify-between items-center">
      {/* Espacio vacío para mantener los elementos a la derecha */}
      <div className="flex items-center w-1/3"></div>

      {/* Este div centrado estaba para el título, ahora vacío */}
      <div className="flex-grow text-center w-1/3"></div>

      {/* Alineación hacia la derecha */}
      <div className="flex items-center w-1/3 justify-end">
        <FaBell className="text-gray-900 mr-8 text-2xl" /> {/* Ajusta el tamaño del icono de la campana y el margen */}
        {user ? (
          <div className="flex items-center bg-white rounded-lg p-1 mr-8">
            <FaUser className="text-blue-500 mr-2 w-7 h-7" /> {/* Ajusta el tamaño del icono de usuario */}
            <div className="text-sm text-black flex items-center">
              <span className="text-blue-500 font-semibold">¡Hola,</span>{" "}
              <span className="ml-1 font-semibold text-black">{firstName}!</span> {/* Primer nombre en negro */}
            </div>
          </div>
        ) : (
          <span className="text-white bg-gray-500 p-1 rounded-lg">Usuario Logueado</span>
        )}
      </div>
    </div>
  );
}

export default UserHeader;
