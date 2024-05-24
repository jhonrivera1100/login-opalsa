import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function cardNewUser() {
  const [latestUser, setLatestUser] = useState(null);

  useEffect(() => {
    const fetchLatestUser = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        const users = response.data;
        if (users.length > 0) {
          setLatestUser(users[users.length - 1]); // Obtener el usuario más reciente
        }
      } catch (error) {
        console.error('Error al obtener el usuario más reciente:', error);
      }
    };

    fetchLatestUser();
  }, []);

  return (
    <div className="p-6 bg-gray-800 text-white rounded-xl w-64 h-[350px] drop-shadow-2xl">
      <div className="flex items-center gap-4 mb-4 pt-4">
        <h3 className="text-lg font-bold text-gray-100">Nueva Solicitud</h3>
      </div>
      {latestUser ? (
        <div className="flex items-center flex-col justify-between pt-3">
          <h4 className="text-xl font-semibold mb-2">{latestUser.username}</h4>
          <h5>{latestUser.cedula}</h5>
          <h5>{latestUser.email}</h5>
          <h5>{latestUser.cargo}</h5>
          <div className='pt-8'>
            <Link to="/Usuarios" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300">
              Ver detalles
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-center pt-16">Cargando...</p>
      )}
    </div>
  );
}