import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FaUsers } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "../api/axios";

function AppAdmin() {
  const [recordatorios, setRecordatorios] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [latestUser, setLatestUser] = useState(null);

  // Función para calcular los días restantes para el recordatorio
const calcularDiasRestantes = (fechaRecordatorio) => {
  const fechaActual = new Date();
  fechaActual.setUTCHours(0, 0, 0, 0); // Establecer la hora a 0 en UTC

  const fecha = new Date(fechaRecordatorio);
  fecha.setUTCHours(0, 0, 0, 0); // Establecer la hora a 0 en UTC

  // Calcular la diferencia en milisegundos
  const diferencia = fecha.getTime() - fechaActual.getTime(); // Diferencia en milisegundos
  const diasRestantes = Math.round(diferencia / (1000 * 60 * 60 * 24)); // Convertir a días completos

  return diasRestantes;
};

  

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

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('/count');
        setUserCount(response.data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
  }, []);

  useEffect(() => {
    fetchRecordatorios();
  }, []);

  const fetchRecordatorios = async () => {
    try {
      // Usamos la nueva ruta para obtener los próximos 10 recordatorios
      const response = await axios.get("/recordatorios/ultimos");
      setRecordatorios(response.data);
    } catch (error) {
      console.error("Error al obtener recordatorios:", error);
    }
  };

  return (
    <div className='grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen font-poppins '> {/* Se añadió font-poppins */}
      <Sidebar/>
      <main className='lg:col-span-3 xl:col-span-5 bg-gray-100 p-4 md:p-8'>
        <div className='flex justify-center pt-5'>
          <Header />
        </div>
        <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-3 xl:grid-cols-4 mt-10 pt-[80px] gap-4'>

          {/* Card 1 */}
          <div className='bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl text-white flex items-center flex-col gap-6 w-full h-full drop-shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl'>
            <FaUsers className='text-7xl animate-pulse' />
            <h4 className='text-3xl font-semibold'>Total Usuarios</h4>
            <div>
              <span className='flex text-4xl text-white font-bold'>
                {userCount} Usuarios
              </span>
            </div>
          </div>

         {/* Card 2 */}
<div className='col-span-2 flex flex-col items-center'>
  <div className='w-full'>
    <h2 className="text-2xl font-bold mb-4 text-center">Recordatorios próximos a cumplir su fecha</h2>
    <ul className='w-full overflow-y-auto max-h-[315px]'>
      {recordatorios.length === 0 ? (
        <p className="text-center text-xl text-gray-500 mt-10">No hay recordatorios aún</p>
      ) : (
        recordatorios.map(recordatorio => {
          const diasRestantes = calcularDiasRestantes(recordatorio.fechaRecordatorio);

          return (
            <li key={recordatorio._id} className={`bg-white p-4 mb-4 rounded flex justify-between items-center shadow-lg duration-300 hover:scale-100 hover:shadow-2xl ${diasRestantes < 0 ? 'border-l-4 border-red-600' : 'border-l-4 border-green-600'}`}>
              <div>
                <span className={`block mb-2 font-bold ${diasRestantes < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {diasRestantes < 0
                    ? `El recordatorio venció hace ${Math.abs(diasRestantes)} días`
                    : diasRestantes === 0
                    ? 'Recordatorio del día de hoy'
                    : `Faltan ${diasRestantes} días`}
                </span>
                <h3 className='text-lg font-bold'>{recordatorio.titulo}</h3>
                <p>
            {new Date(
              new Date(recordatorio.fechaRecordatorio).getTime() +
                new Date(recordatorio.fechaRecordatorio).getTimezoneOffset() *
                  60000
            ).toLocaleDateString()}
          </p>
              </div>
            </li>
          );
        })
      )}
    </ul>
  </div>
</div>



          {/* Card 3 */}
          <div className="p-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-2xl w-full h-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-lg font-bold text-gray-100">Último Usuario Creado</h3>
            </div>
            {latestUser ? (
              <div className="flex items-center flex-col justify-between pt-3">
                <h4 className="text-xl font-light mb-2" title={latestUser.username.length > 20 ? latestUser.username.substring(0, 20) + '...' : latestUser.username}>
                  {latestUser.username}
                </h4>
                <h5 title={latestUser.cedula}>{latestUser.cedula}</h5>
                <h5 title={latestUser.email.length > 20 ? latestUser.email.substring(0, 20) + '...' : latestUser.email}>
                  {latestUser.email}
                </h5>
                <h5 title={latestUser.cargo}>{latestUser.cargo}</h5>
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

        </section>
      </main>
    </div>
  );
}

export default AppAdmin;