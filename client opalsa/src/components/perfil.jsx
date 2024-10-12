import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaBriefcase, FaMapMarkerAlt, FaIdCard, FaEnvelope } from 'react-icons/fa'; // Importamos los iconos

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    ciudad: user?.ciudad || '',
    cargo: user?.cargo || '',
    cedula: user?.cedula || '',
    email: user?.email || '',
    role: user?.role || '',
  });

  const [successMessage, setSuccessMessage] = useState(''); // Estado para mensajes de éxito
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        ciudad: user.ciudad || '',
        cargo: user.cargo || '',
        cedula: user.cedula || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  // UseEffect para ocultar los mensajes después de 5 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
    }
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!user || !user._id) {
        console.error('ID de usuario no encontrado');
        setErrorMessage('Error: ID de usuario no encontrado.');
        return;
      }
      const response = await axios.put(
        `http://localhost:4000/api/users/${user._id}`,
        formData,
        { withCredentials: true }
      );
      updateUser(response.data);
      setSuccessMessage('¡Datos actualizados exitosamente!');
      setErrorMessage(''); // Limpiamos el mensaje de error si la actualización es exitosa
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setErrorMessage('Hubo un error al actualizar los datos. Inténtalo nuevamente.');
      setSuccessMessage(''); // Limpiamos el mensaje de éxito si hay un error
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen">
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="flex flex-col lg:flex-row justify-between w-full max-w-[1300px] gap-8">
            {/* Card 1: Datos del usuario como formulario editable */}
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full lg:w-3/5 relative">
              {/* Título con fondo azul y superposición */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-800 w-[300px] h-[50px] rounded flex items-center justify-center z-20 shadow-lg">
                <h3 className="text-xl font-bold text-white">Actualizar mi perfil</h3>
              </div>
              {/* Mensajes de éxito o error */}
              {successMessage && (
                <div className="bg-green-200 text-green-800 p-2 rounded mb-4 text-center">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="bg-red-200 text-red-800 p-2 rounded mb-4 text-center">
                  {errorMessage}
                </div>
              )}
              {/* Contenido del formulario */}
              <div className="relative z-10 mt-8">
                <form onSubmit={handleUpdate}>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Nombre de Usuario</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Cargo</label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Cédula (No Editable)</label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Email (No Editable)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Rol (No Editable)</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md"
                    >
                      Actualizar Datos
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Card 2: Icono del usuario, nombre, cargo, ciudad y cédula */}
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full lg:w-1/3 flex flex-col justify-center items-center relative">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-800 w-[200px] h-[50px] rounded flex items-center justify-center z-20 shadow-lg">
                <h3 className="text-xl font-bold text-white">Perfil</h3>
              </div>
              <img
                alt="Perfil"
                src="https://res.cloudinary.com/dtqiwgbbp/image/upload/v1728741926/usuario_1_vwhwg6.png"
                className="shadow-lg rounded-full h-auto align-middle border-none max-w-[150px] mb-6 mt-8"
              />
              <h3 className="text-2xl text-center font-semibold leading-normal mb-4 text-blue-600">
                {formData.username || 'Nombre del Usuario'}
              </h3>
              <div className="text-gray-600 text-lg mb-2 flex items-center">
                <FaBriefcase className="mr-2 text-blue-600" />
                {formData.cargo || 'Cargo no especificado'}
              </div>
              <div className="text-gray-600 text-lg mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                {formData.ciudad || 'Ciudad no especificada'}
              </div>
              <div className="text-gray-600 text-lg mb-2 flex items-center">
                <FaIdCard className="mr-2 text-blue-600" />
                {formData.cedula || 'Cédula no especificada'}
              </div>
              <div className="text-gray-600 text-lg flex items-center">
                <FaEnvelope className="mr-2 text-blue-600" />
                {formData.email || 'Email no especificado'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Perfil;
