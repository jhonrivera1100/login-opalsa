import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FaTrashAlt } from 'react-icons/fa';
import HeaderUsuarios from '../components/HeaderUsuarios';
import { FiSearch } from 'react-icons/fi';

function GestionUsuarios() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const permissionsList = [
    'Permiso 1',
    'Permiso 2',
    'Permiso 3',
    'Permiso 4',
    'Permiso 5'
  ];

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

  const handleShowPermissions = (user) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions(prevState => {
      if (prevState.includes(permission)) {
        return prevState.filter(p => p !== permission);
      } else {
        return [...prevState, permission];
      }
    });
  };

  const handleSavePermissions = async () => {
    try {
      await axios.put(`http://localhost:4000/api/users/${selectedUser._id}/permissions`, { permissions: selectedPermissions });
      setUsers(users.map(user => user._id === selectedUser._id ? { ...user, permissions: selectedPermissions } : user));
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar permisos:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen'>
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
        <div className='overflow-x-auto'>
          <div className='min-w-full'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 text-left pl-5'>
              <div className='font-semibold'>Nombre</div>
              <div className='font-semibold'>Cédula</div>
              <div className='font-semibold'>Correo Electronico</div>
              <div className='font-semibold'>Cargo</div>
              <div className='font-semibold'>Permisos</div>
              <div className='font-semibold'>Eliminar</div>
            </div>
            {filteredUsers.map(user => (
              <div key={user._id} className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 bg-white items-center p-4 drop-shadow-xl'>
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
                  <button
                    onClick={() => handleShowPermissions(user)}
                    className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300'>
                    Ver Permisos
                  </button>
                </div>
                <div className='flex justify-center lg:justify-start'>
                  <button onClick={() => handleDelete(user._id)} className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Permisos de {selectedUser.username}</h2>
            <p><strong>Cargo:</strong> {selectedUser.cargo}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <div className="mt-4">
              {permissionsList.map(permission => (
                <div key={permission}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={selectedPermissions.includes(permission)}
                      onChange={() => handlePermissionChange(permission)}
                    />
                    <span className="ml-2">{permission}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg transition duration-300">
                Guardar
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg transition duration-300">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionUsuarios;