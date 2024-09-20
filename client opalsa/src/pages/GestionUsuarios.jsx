import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaTrashAlt } from 'react-icons/fa';
import HeaderUsuarios from '../components/HeaderUsuarios';
import { FiSearch } from 'react-icons/fi';

function GestionUsuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullEmail, setShowFullEmail] = useState(false);
  const [tooltipId, setTooltipId] = useState(null);

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

  const handleToggleEmail = (tooltipId) => {
    setShowFullEmail(!showFullEmail);
    setTooltipId(tooltipId); // Actualiza el estado con el ID del tooltip
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`http://localhost:4000/api/users/${userId}/role`, { role: newRole });
      // Recargar la página
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
    <div className='grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen font-poppins'> {/* Se añadió font-poppins */}
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
        <div className=''>
          <div className='overflow-x-auto pt-14'>
            <div className='min-w-full'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-4 text-left pl-5'>
                <div className='font-semibold'>Nombre</div>
                <div className='font-semibold'>Cédula</div>
                <div className='font-semibold'>Ciudad</div>
                <div className='font-semibold'>Correo Electronico</div>
                <div className='font-semibold lg:pl-8'>Cargo</div>
                <div className='font-semibold lg:pl-8'>Rol</div>
                <div className='font-semibold'>Eliminar</div>
              </div>
              <div className='overflow-y-auto max-h-[650px]'>
                {filteredUsers.map(user => (
                  <div key={user._id} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 mb-4 bg-white items-center p-4 drop-shadow-xl'>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
                    </div>
                    <div>
                      <p className="text-gray-600">{user.cedula}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{user.ciudad}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 overflow-hidden truncate" onClick={handleToggleEmail} title={user.email}>{user.email}</p>
                    </div>
                    <div className='lg:pl-8'>
                      <p className="text-gray-600">{user.cargo}</p>
                    </div>
                    <div className='lg:pl-3'>
                      <button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className={`w-[105px] py-2 text-white rounded-lg transition duration-300 ${getRoleButtonClasses(user.role)}`}>
                        {user.role}
                      </button>
                    </div>
                    <div className='flex justify-center lg:justify-start px-8'>
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
    </div>
  );
}

export default GestionUsuarios;
