import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaTrashAlt, FaRegUser } from 'react-icons/fa'; // Añadido el ícono
import HeaderUsuarios from '../components/HeaderUsuarios';
import { FiSearch } from 'react-icons/fi';

function GestionUsuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tooltipId, setTooltipId] = useState(null); // Para controlar qué tooltip está activo

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

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`http://localhost:4000/api/users/${userId}/role`, { role: newRole });
      window.location.reload();
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
    }
  };

  const getRoleButtonClasses = (role) => {
    return role === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700';
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen font-poppins'>
      <Sidebar />
      <div className='lg:col-span-3 xl:col-span-5 p-4 lg:p-8'>
        <div className='mb-4 flex flex-col lg:flex-row lg:justify-between'>
          <HeaderUsuarios />
          <div className='relative mt-4 lg:mt-0 lg:ml-4'>
            <div className='relative w-full'>
              <FiSearch className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
              <input
                type="text"
                className='bg-gray-200 outline-none py-2 pl-10 pr-4 rounded-xl w-full'
                placeholder='Busqueda de Usuarios'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className='overflow-x-auto pt-14'>
          <div className='min-w-full'>
            <div className='hidden lg:grid grid-cols-7 gap-4 mb-4 text-left pl-5'>
              <div className='font-semibold'>Nombre</div>
              <div className='font-semibold'>Cédula</div>
              <div className='font-semibold'>Ciudad</div>
              <div className='font-semibold'>Correo Electrónico</div>
              <div className='font-semibold lg:pl-8'>Cargo</div>
              <div className='font-semibold lg:pl-8'>Rol</div>
              <div className='font-semibold'>Eliminar</div>
            </div>
            <div className='overflow-y-auto max-h-[650px]'>
              {filteredUsers.map(user => (
                <div 
                  key={user._id} 
                  className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-4 bg-white items-start lg:items-center p-4 drop-shadow-xl'
                >
                  {/* Nombre con tooltip */}
<div 
  className="relative lg:flex lg:space-x-2 text-gray-400 text-sm" 
  onMouseEnter={() => setTooltipId(user._id)} 
  onMouseLeave={() => setTooltipId(null)}
>
  <FaRegUser className="h-5 w-5" />
  <p>{user.username.length > 8 ? user.username.slice(0, 15) + '...' : user.username}</p>
  {tooltipId === user._id && (
    <div 
      className="absolute left-0 top-full mt-1 p-2 bg-black text-white text-sm rounded-md shadow-lg" 
      style={{ zIndex: 10, whiteSpace: 'nowrap' }} // Evitar el salto de línea
    >
      {user.username}
    </div>
  )}
</div>


                  {/* Cédula */}
                  <div className="lg:flex lg:space-x-2">
                    <span className="block font-bold lg:hidden">Cédula:</span>
                    <p className="text-gray-600">{user.cedula}</p>
                  </div>

                  {/* Ciudad */}
                  <div className="lg:flex lg:space-x-2">
                    <span className="block font-bold lg:hidden">Ciudad:</span>
                    <p className="text-gray-600">{user.ciudad}</p>
                  </div>

                  {/* Correo con tooltip */}
                  <div 
                    className="relative lg:flex lg:space-x-2 text-gray-400 text-sm" 
                    onMouseEnter={() => setTooltipId(user._id + '-email')} 
                    onMouseLeave={() => setTooltipId(null)}
                  >
                    <p>{user.email.length > 8 ? user.email.slice(0, 20) + '...' : user.email}</p>
                    {tooltipId === user._id + '-email' && (
                      <div className="absolute left-0 top-full mt-1 p-2 bg-black text-white text-sm rounded-md shadow-lg">
                        {user.email}
                      </div>
                    )}
                  </div>

                  {/* Cargo con tooltip */}
                  <div 
                    className="relative lg:flex lg:space-x-2 text-gray-400 text-sm lg:pl-8" 
                    onMouseEnter={() => setTooltipId(user._id + '-cargo')} 
                    onMouseLeave={() => setTooltipId(null)}
                  >
                    <p>{user.cargo.length > 8 ? user.cargo.slice(0, 8) + '...' : user.cargo}</p>
                    {tooltipId === user._id + '-cargo' && (
                      <div className="absolute left-0 top-full mt-1 p-2 bg-black text-white text-sm rounded-md shadow-lg"
                      style={{ zIndex: 10, whiteSpace: 'nowrap' }} // Evitar el salto de línea
                      >
                        {user.cargo}
                      </div>
                    )}
                  </div>

                  {/* Rol */}
                  <div className="lg:pl-3">
                    <span className="block font-bold lg:hidden">Rol:</span>
                    <button
                      onClick={() => handleRoleChange(user._id, user.role)}
                      className={`w-[105px] py-2 text-white rounded-lg transition duration-300 ${getRoleButtonClasses(user.role)}`}>
                      {user.role}
                    </button>
                  </div>

                  {/* Eliminar */}
                  <div className="flex justify-center lg:justify-start px-8">
                    <span className="block font-bold lg:hidden">Eliminar:</span>
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
    </div>
  );
}

export default GestionUsuarios;
