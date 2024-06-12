import React from 'react';
import { FaBell, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function UserHeader() {
  const { user } = useAuth();

  // Variable para almacenar el título según la sección actual
  let title;

  // Lógica para determinar el título según la sección actual
  switch (window.location.pathname) {
    case '/':
      title = 'Inicio';
      break;
    case '/GestionMaquinas':
      title = 'Gestión de Máquinas';
      break;
    case '/Historial':
      title = 'Historial';
      break;
    case '/RegistroMantenimiento':
      title = 'Mantenimientos';
      break;
    case '/profile':
      title = 'Perfil';
      break;
    case '/admin':
      title = 'Administrador';
      break;
    default:
      title = 'Título genérico';
  }

  return (
    <div className="bg-slate-200 p-1 flex justify-between items-center">
      <div className="flex items-center w-1/3"></div> {/* Espacio vacío para mantener los elementos a la derecha */}
      <div className="text-white font-bold flex-grow text-center w-1/3">{title}</div> {/* Mostrar el título centrado */}
      <div className="flex items-center w-1/3 justify-end"> {/* Alineación hacia la derecha */}
        <FaBell className="text-white-900 mr-8 text-2xl" /> {/* Ajusta el tamaño del icono de la campana y el margen */}
        {user ? (
          <div className="flex items-center bg-white rounded-lg p-1 mr-8"> {/* Ajusta el margen */}
            <FaUser className="text-blue-900 mr-2 w-7 h-7" /> {/* Ajusta el tamaño del icono de usuario */}
            <div className="text-sm text-black"> {/* Aplica la clase text-sm para reducir el tamaño de las letras */}
              <div className="font-bold">{user.username}</div>
              <div>{user.email}</div>
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
