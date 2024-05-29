import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import { FaTrashAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

function NotificacionesAdmin() {
  const [recordatorios, setRecordatorios] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [fechaRecordatorio, setFechaRecordatorio] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecordatorios();
  }, []);

  const fetchRecordatorios = async () => {
    try {
      const response = await axios.get("/recordatorios");
      setRecordatorios(response.data);
    } catch (error) {
      console.error("Error al obtener recordatorios:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRecordatorios = recordatorios.filter(recordatorio =>
    recordatorio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/recordatorios", {
        titulo,
        fechaRecordatorio,
      });
      setRecordatorios([...recordatorios, response.data]);
      setTitulo("");
      setFechaRecordatorio("");
    } catch (error) {
      console.error("Error al crear recordatorio:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/recordatorios/${id}`);
      setRecordatorios(recordatorios.filter(recordatorio => recordatorio._id !== id));
    } catch (error) {
      console.error("Error al eliminar recordatorio:", error);
    }
  };

  return (
    <div className='grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen'>
      <Sidebar />
      <div className='col-span-3 xl:col-span-5 p-8'>
        <div className='mb-4 flex justify-around'>
          <HeaderNotificaciones />
          <div className='relative mb-4 pt-4'>
            <div className='relative w-full md:w-auto'>
              <FiSearch className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
              <input
                type="text"
                className='bg-gray-200 outline-none py-2 pl-10 pr-4 rounded-xl w-full md:w-auto'
                placeholder='Buscar Recordatorios'
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className='flex pt-[50px] pl-9'>
          <div className='w-[500px] h-[435px] p-8 bg-white rounded-xl shadow-lg'>
            <h2 className="text-2xl font-bold mb-4">Crear Recordatorio</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Título</label>
                <input
                  type='text'
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Fecha de Recordatorio</label>
                <input
                  type='date'
                  value={fechaRecordatorio}
                  onChange={(e) => setFechaRecordatorio(e.target.value)}
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  required
                />
              </div>
              <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                Crear
              </button>
            </form>
          </div>
          <div className='w-[600px] pl-[80px] '>
            <h2 className="text-2xl font-bold mb-4">Recordatorios</h2>
            <div className='overflow-y-auto max-h-[400px]'>
              <ul>
                {filteredRecordatorios.map(recordatorio => (
                  <li key={recordatorio._id} className='bg-white p-4 mb-4 rounded flex justify-between items-center shadow-lg'>
                    <div>
                      <h3 className='text-lg font-bold'>{recordatorio.titulo}</h3>
                      <p>{new Date(recordatorio.fechaRecordatorio).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleDelete(recordatorio._id)} className="text-red-500 hover:text-red-700">
                      <FaTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificacionesAdmin;