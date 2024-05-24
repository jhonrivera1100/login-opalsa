import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';

const UserCard = ({ user, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 w-full max-w-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">{user.nombre}</h3>
        <button onClick={() => onDelete(user.id)} className="text-red-500 hover:text-red-700">
          <FaTrashAlt />
        </button>
      </div>
      <div className="text-gray-600">
        <p><span className="font-semibold">Cédula:</span> {user.cedula}</p>
        <p><span className="font-semibold">Cargo:</span> {user.cargo}</p>
        <p><span className="font-semibold">Estado:</span> {user.estado}</p>
        <p><span className="font-semibold">Permisos:</span> {user.permisos}</p>
      </div>
    </div>
  );
};

export default UserCard;