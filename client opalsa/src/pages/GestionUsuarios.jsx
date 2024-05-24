import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaTrashAlt } from 'react-icons/fa';
import HeaderUsuarios from '../components/HeaderUsuarios';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

function GestionUsuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen'>
      <Sidebar />
      <div className='col-span-3 xl:col-span-5 p-8'>
        <div className='mb-4 flex justify-around'>
          <HeaderUsuarios />
          <div className='relative mb-4 pt-4'>
          <div className='relative w-full md:w-auto'>
            <FiSearch className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
            <input
              type="text"
              className='bg-gray-200 outline-none py-2 pl-10 pr-4 rounded-xl w-full md:w-auto'
              placeholder='Busqueda de Usuarios'
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        </div>
       
        <div className='overflow-x-auto pt-8'>
          <div className='min-w-full'>
            <div className='grid grid-cols-6 gap-4 mb-4 text-left pl-5'>
              <div className='font-semibold'>Nombre</div>
              <div className='font-semibold'>Cédula</div>
              <div className='font-semibold pr-9'>Correo Electronico</div>
              <div className='font-semibold'>Cargo</div>
              <div className='font-semibold'>Permisos</div>
              <div className='font-semibold'>Eliminar</div>
            </div>
            {filteredUsers.map(user => (
              <div key={user._id} className='grid grid-cols-6 gap-4 mb-4 bg-white items-center p-4 drop-shadow-xl'>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
                </div>
                <div>
                  <p className="text-gray-600">{user.cedula}</p>
                </div>
                <div>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">{user.cargo}</p>
                </div>
                <div>
                  <Link className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300'>Ver Permisos</Link>
                </div>
                <div className='flex pl-9'>
                  <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionUsuarios;