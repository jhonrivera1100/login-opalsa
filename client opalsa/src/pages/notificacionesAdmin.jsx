import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import { FaTrashAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ModalNotificaciones";

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
    setSelectedRecordatorio(recordatorio);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRecordatorio(null);
  };

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar />
      <div className="col-span-3 xl:col-span-5 p-8">
        <div className="mb-4 flex justify-around">
          <HeaderNotificaciones />
          <div className="relative mb-4 pt-4">
            <div className="relative w-full md:w-auto">
              <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="bg-gray-200 outline-none py-2 pl-10 pr-4 rounded-xl w-full md:w-auto"
                placeholder="Buscar Recordatorios"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="w-full pt-6">
          <div className="h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecordatorios.map(recordatorio => (
                <div key={recordatorio._id} className="border border-gray-200 rounded-lg shadow-lg hover:shadow-md transition-shadow duration-300">
                  <div className="bg-blue-500 text-white py-2 px-2 text-center font-bold rounded-t-lg">
                    <h3 className="text-lg font-bold">Recordatorios</h3>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <div className="space-y-2">
                    <div>
                        <strong>Titulo:</strong>
                        <p>{recordatorio.titulo}</p>
                      </div>
                      <div>
                        <strong>Descripción:</strong>
                        <p
                          className="cursor-pointer text-gray-500"
                          onClick={() => handleDescriptionClick(recordatorio)}
                        >
                          {recordatorio.descripcion.length > 30
                            ? `${recordatorio.descripcion.substring(0, 100)}...`
                            : recordatorio.descripcion}
                        </p>
                      </div>
                      <div>
                        <strong>Fecha:</strong>
                        <p>{new Date(recordatorio.fechaRecordatorio).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <strong>Usuario:</strong>
                        <p>{recordatorio.usuario ? recordatorio.usuario.username : "Desconocido"}</p>
                      </div>
                    </div>
                    <button
                      className="mt-4 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                      onClick={() => handleDelete(recordatorio._id)}
                    >
                      Eliminar
                    </button>
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
