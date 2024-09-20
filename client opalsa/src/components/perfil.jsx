import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UpdateProfileModal from '../components/ModalActualizarD';
import axios from 'axios';

const Perfil = () => {
  const { user, loading, updateUser } = useAuth();
  const [userData, setUserData] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchUserData();
    }
  }, [user, loading]);  // Dependencia en `loading` también

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${user._id}`, { withCredentials: true });
      setUserData(response.data);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/users/${user._id}`, formData, { withCredentials: true });
      updateUser(response.data);
      setUserData(response.data);  // Actualiza el estado local con los datos nuevos
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (!userData) return <p>No hay datos disponibles.</p>;

  return (
    <main>
      <section className="relative block h-[500px]">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{ backgroundImage: "url('https://wallpapercave.com/wp/wp4035445.jpg')" }}
        >
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
      </section>
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-[1200px] mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <img
                      alt="..."
                      src="https://c0.klipartz.com/pngpicture/507/702/gratis-png-icono-de-perfil-icono-de-usuario-simple.png"
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <button
                      onClick={handleOpenModal}
                      className="bg-blue-500 active:bg-blue-300 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                    >
                      Actualizar Datos
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal text-blueGray-700">
                  {userData.username || 'Nombre del Usuario'}
                </h3>
                <div className="text-sm leading-normal text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {userData.ciudad || 'Ciudad no especificada'}
                </div>
                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                  {userData.cargo || 'Cargo no especificado'}
                </div>
                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                      <h3>Cédula: {userData.cedula || 'recargar la página'}</h3>
                      <h3>Email: {userData.email || 'recargar la página'}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="relative bg-blueGray-200 pt-8 pb-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center">
              <div className="w-full md:w-6/12 px-4 text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">OPALSA SAS</div>
              </div>
            </div>
          </div>
        </footer>
      </section>
      {isModalOpen && (
        <UpdateProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={userData}
          onUpdate={handleUpdate}
        />
      )}
    </main>
  );
};

export default Perfil;
