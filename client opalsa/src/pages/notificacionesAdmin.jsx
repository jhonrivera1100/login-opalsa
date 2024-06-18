import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import { FaTrashAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ModalNotificaciones"; // Asegúrate de tener un componente Modal

const NotificacionesAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const [recordatorios, setRecordatorios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecordatorio, setSelectedRecordatorio] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecordatorios();
    }
  }, [isAuthenticated]);

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/recordatorios/${id}`);
      setRecordatorios(recordatorios.filter(recordatorio => recordatorio._id !== id));
    } catch (error) {
      console.error("Error al eliminar recordatorio:", error);
    }
  };

  const handleDescriptionClick = (recordatorio) => {
    if (recordatorio.descripcion.length > 30) {
      setSelectedRecordatorio(recordatorio);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecordatorio(null);
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
        <div className='w-[600px]'>
          <h2 className="text-2xl font-bold mb-4">Recordatorios</h2>
          <div className='overflow-y-auto max-h-[400px]'>
            <ul>
              {filteredRecordatorios.map(recordatorio => (
                <li key={recordatorio._id} className='bg-white p-4 mb-4 rounded-lg shadow-lg flex justify-between items-start'>
                  <div className="space-y-2">
                    <h3 className='text-lg font-bold'>{recordatorio.titulo}</h3>
                    <div>
                      <span className="font-semibold">Descripción: </span>
                      <p
                        className={`cursor-pointer ${recordatorio.descripcion.length > 30 ? 'text-gray-500 hover:underline' : ''}`}
                        onClick={() => handleDescriptionClick(recordatorio)}
                      >
                        {recordatorio.descripcion.length > 30
                          ? `${recordatorio.descripcion.substring(0, 30)}...`
                          : recordatorio.descripcion}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold">Fecha: </span>
                      <p>{new Date(recordatorio.fechaRecordatorio).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Usuario: </span>
                      <p>{recordatorio.usuario ? recordatorio.usuario.username : "Desconocido"}</p>
                    </div>
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
      {modalVisible && selectedRecordatorio && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            <h3 className="text-lg font-bold">{selectedRecordatorio.titulo}</h3>
            <p className="mt-2 whitespace-pre-wrap">{selectedRecordatorio.descripcion}</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NotificacionesAdmin;
