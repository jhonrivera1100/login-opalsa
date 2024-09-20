import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UpdateProfileModal from '../components/ModalActualizarD';
import axios from 'axios';

const Perfil = () => {
  const { user, loading, updateUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    if (!loading && user && user._id && !userData) {
      fetchUserData();
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${user._id}`, { withCredentials: true });
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      setError('No se pudieron cargar los datos del usuario.');
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Función para abrir el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Función para cerrar el modal
  };

  const handleUpdate = async (formData) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/users/${user._id}`, formData, { withCredentials: true });
      updateUser(response.data);
      setUserData(response.data); // Actualiza los datos del usuario en el frontend
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  if (isLoading) return <p>Cargando datos del usuario...</p>;
  if (error) return <p>{error}</p>;
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
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[70px]"
          style={{ transform: 'translateZ(0px)' }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-[1200px] mb-6 shadow-xl rounded-lg -mt-64 pl-10">
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
                  <div className="py-6 px-3 mt-32 sm:mt-0 px-9">
                    <button
                      onClick={handleOpenModal} // Abre el modal cuando se hace clic
                      className="bg-blue-500 active:bg-blue-300 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      Actualizar Datos
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                  {user.username || 'Nombre del Usuario'}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {user.ciudad || 'Ciudad no especificada'}
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                  {user.cargo || 'Cargo no especificado'}
                </div>
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <h3>Cédula: {user.cedula || 'recargar la página'}</h3>
                    <h3>Email: {user.email || 'recargar la página'}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="relative bg-blueGray-200 pt-8 pb-6 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">OPALSA SAS</div>
              </div>
            </div>
          </div>
        </footer>
      </section>
      <UpdateProfileModal
        isOpen={isModalOpen} // Controla el estado del modal con isModalOpen
        onClose={handleCloseModal} // Función para cerrar el modal
        user={user}
        onUpdate={handleUpdate}
      />
    </main>
  );
};

export default Perfil;
