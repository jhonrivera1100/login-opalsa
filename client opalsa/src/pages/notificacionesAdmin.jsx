import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ModalNotificaciones";
import { FaRegUser } from "react-icons/fa";
import { GoDiscussionClosed } from "react-icons/go";

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
      const recordatoriosConVisto = response.data.map(recordatorio => ({
        ...recordatorio,
        visto: recordatorio.visto || false // Asegurarse de que el campo visto esté definido
      }));
      setRecordatorios(recordatoriosConVisto);
    } catch (error) {
      console.error("Error al obtener recordatorios:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckboxChange = async (id, visto) => {
    try {
      console.log(`Actualizando recordatorio ${id} a visto: ${!visto}`);
      const response = await axios.patch(`/recordatorios/${id}/visto`, { visto: !visto });
      console.log('Respuesta del servidor:', response.data);
      setRecordatorios(prevRecordatorios =>
        prevRecordatorios.map(recordatorio =>
          recordatorio._id === id ? { ...recordatorio, visto: response.data.visto } : recordatorio
        )
      );
    } catch (error) {
      console.error("Error al actualizar el estado de visto:", error);
    }
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
    setSelectedRecordatorio(recordatorio);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecordatorio(null);
  };

  const handleOpenFile = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <div className="lg:col-span-3 xl:col-span-5 p-4 lg:p-8">
        <div className="mb-4 flex flex-col lg:flex-row lg:justify-between">
          <HeaderNotificaciones />
          <div className="relative mt-4 lg:mt-0 lg:ml-4">
            <div className="relative w-full">
              <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="bg-gray-200 outline-none py-2 pl-10 pr-4 rounded-xl w-full"
                placeholder="Buscar Recordatorios"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="w-full pt-6">
          <div className="h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRecordatorios.map(recordatorio => (
                <div key={recordatorio._id} className={`relative py-6 px-6 rounded-3xl w-[250px] my-4 shadow-xl ${recordatorio.visto ? 'bg-green-200' : 'bg-white'}`}>
                  <div className="flex items-center justify-end space-x-2">
                    <input
                      type="checkbox"
                      checked={recordatorio.visto}
                      onChange={() => handleCheckboxChange(recordatorio._id, recordatorio.visto)}
                      className="form-checkbox h-5 w-5 text-green-600"
                    />
                    <label className="text-gray-600">Visto</label>
                  </div>
                  <div className="text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-yellow-500 left-4 -top-4">
                    <GoDiscussionClosed className="w-8 h-8"/>
                  </div>
                  <div className="mt-8">
                    <p className="text-xl font-semibold my-2">Notificacion</p>
                    <div className="flex space-x-2 text-gray-400 text-sm">
                      <FaRegUser className="h-5 w-5"/>
                      <p> {recordatorio.usuario ? recordatorio.usuario.username : "Desconocido"}</p>
                    </div>
                    <div className="flex space-x-2 text-gray-400 text-sm my-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p> {new Date(recordatorio.fechaRecordatorio).toLocaleDateString()}</p>
                    </div>
                    <div className="border-t-2"></div>
                    <div className="mt-4">
                      <p className="text-gray-600 mb-2">
                        <strong>Título:</strong> {recordatorio.titulo}
                      </p>
                      <p className="text-gray-600 mb-2 cursor-pointer" onClick={() => handleDescriptionClick(recordatorio)}>
                        <strong>Descripción:</strong> {recordatorio.descripcion.length > 10 ? `${recordatorio.descripcion.substring(0, 8)}...` : recordatorio.descripcion}
                      </p>
                      <div className="flex justify-center mt-2 space-x-2">
                        <button
                          className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                          onClick={() => handleDelete(recordatorio._id)}
                        >
                          Eliminar
                        </button>
                        {recordatorio.documentoRecordatorio.length > 0 && (
                          <button
                            className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                            onClick={() => handleOpenFile(recordatorio.documentoRecordatorio[0].url)}
                          >
                            Ver Archivo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {modalVisible && selectedRecordatorio && (
        <Modal onClose={closeModal} description={selectedRecordatorio.descripcion}>
          <div className="p-4">
            <h3 className="text-lg font-bold">{selectedRecordatorio.titulo}</h3>
            <p className="mt-2">
              {selectedRecordatorio.descripcion.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default NotificacionesAdmin;
