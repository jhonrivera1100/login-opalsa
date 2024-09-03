import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ModalNotificaciones";
import ModalOrden from "../components/ModalFormOrden"; // Importa el ModalOrden
import { FaRegUser } from "react-icons/fa";
import { GoDiscussionClosed } from "react-icons/go";
import { BsFileEarmarkText } from "react-icons/bs";
import debounce from 'lodash/debounce';
import ModalSobrantes from "../components/ModalSobrantes";

const NotificacionesAdmin = () => {
  const [combinedItems, setCombinedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOrdenVisible, setModalOrdenVisible] = useState(false);
  const [showSobrantesModal, setShowSobrantesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const intervalId = setInterval(fetchData, 5000); // Actualiza cada 5 segundos
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [recordatoriosResponse, ordenesResponse] = await Promise.all([
        axios.get("/recordatorios"),
        axios.get("/ordenes")
      ]);

      const combinedItems = [
        ...recordatoriosResponse.data.map(recordatorio => ({
          ...recordatorio,
          type: "recordatorio",
          fecha: new Date(recordatorio.fechaRecordatorio),
          descripcion: recordatorio.descripcion || "",
        })),
        ...ordenesResponse.data.map(orden => ({
          ...orden,
          type: "orden",
          fecha: new Date(orden.fechaOrden),
          descripcionOrden: orden.descripcionOrden || "",
        }))
      ];

      combinedItems.sort((a, b) => b.fecha - a.fecha);

      setCombinedItems(combinedItems);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = combinedItems.filter(item =>
    (item.descripcion && item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.descripcionOrden && item.descripcionOrden.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDescriptionClick = (item) => {
    setSelectedItem({
      type: item.type,
      content: item.descripcion || item.descripcionOrden || "No hay descripción disponible"
    });
    setModalVisible(true);
  };

  const handleUserClick = (item) => {
    setSelectedItem({
      type: "usuario",
      content: item.usuario ? item.usuario.username : "Desconocido"
    });
    setModalVisible(true);
  };

  const handleAcceptOrder = (item) => {
    setSelectedItem(item); // Guarda la orden seleccionada
    setModalOrdenVisible(true); // Muestra el modal
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const closeModalOrden = () => {
    setModalOrdenVisible(false);
    setSelectedItem(null);
  };


  const handleOpenFile = (url) => {
    window.open(url, '_blank');
  };

  const handleDeleteItem = async (id, type) => {
    try {
      if (type === "recordatorio") {
        await axios.delete(`/recordatorios/${id}`);
      } else if (type === "orden") {
        await axios.delete(`/ordenes/${id}`);
      }
      setCombinedItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  const handleCheckboxChange = useCallback(
    debounce(async (id, visto) => {
      try {
        console.log(`Actualizando recordatorio ${id} a visto: ${!visto}`);
        const response = await axios.patch(`/recordatorios/${id}/visto`, { visto: !visto });
        console.log('Respuesta del servidor:', response.data);
        setCombinedItems(prevItems =>
          prevItems.map(item =>
            item._id === id ? { ...item, visto: response.data.visto } : item
          )
        );
      } catch (error) {
        console.error("Error al actualizar el estado de visto:", error);
      }
    }, 50),
    []
  );

  const handleCheckboxAceptar = useCallback(
    debounce(async (id, aceptar) => {
      try {
        console.log(`Actualizando orden ${id} a aceptado: ${!aceptar}`);
        const response = await axios.patch(`/ordenes/${id}/aceptar`, { aceptado: !aceptar });
        console.log('Respuesta del servidor:', response.data);
  
        // Actualiza el estado local con la respuesta del servidor
        setCombinedItems(prevItems =>
          prevItems.map(item =>
            item._id === id ? { ...item, aceptado: response.data.aceptado } : item
          )
        );
      } catch (error) {
        console.error("Error al actualizar el estado de aceptado:", error);
      }
    }, 50), // Ajusta el debounce según sea necesario
    []
  );
  


  const handleOpenSobrantesModal = (item) => {
    setSelectedItem(item);
    setShowSobrantesModal(true);
  };

  const closeSobrantesModal = () => {
    setShowSobrantesModal(false);
    setSelectedItem(null);
  };

  const handleSaveSobrantes = (data) => {
    setCombinedItems(prevItems =>
      prevItems.map(item =>
        item._id === selectedItem._id ? { ...item, ...data } : item
      )
    );
    closeSobrantesModal();
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
                placeholder="Buscar"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="w-full pt-6">
          <div className="h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
               <div
               key={item._id}
               className={`relative py-6 px-6 rounded-3xl w-[250px] my-4 shadow-xl ${
                 item.type === "recordatorio"
                   ? item.visto
                     ? "bg-green-200"
                     : "bg-white"
                   : item.aceptado // Añade la condición para cuando está aceptado
                   ? "bg-green-200" // Color de fondo cuando está aceptado
                   : "bg-white" // Color de fondo cuando no está aceptado
               }`}
             >
                  <div
                    className={`text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl ${
                      item.type === "recordatorio" ? "bg-yellow-500" : "bg-green-500"
                    } left-4 -top-4`}
                  >
                    {item.type === "recordatorio" ? (
                      <GoDiscussionClosed className="w-8 h-8" />
                    ) : (
                      <BsFileEarmarkText className="w-8 h-8" />
                    )}
                  </div>
                  <div className="flex items-center justify-end space-x-2 absolute top-4 right-4">
                    {item.type === "recordatorio" && (
                      <>
                        <input
                          type="checkbox"
                          checked={item.visto}
                          onChange={() => handleCheckboxChange(item._id, item.visto)}
                          className="form-checkbox h-5 w-5 text-green-600"
                        />
                        <label className="text-gray-600">Visto</label>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-end space-x-2 absolute top-4 right-4">
  {item.type === "orden" && (
    <>
      <input
        type="checkbox"
        checked={item.aceptado}
        onChange={() => handleCheckboxAceptar(item._id, item.aceptado)} // Usa handleCheckboxAceptar aquí
        className="form-checkbox h-5 w-5 text-green-600"
      />
      <label className="text-gray-600">Terminada</label>
    </>
  )}
</div>
                  <div className="mt-8">
                    <p className="text-xl font-semibold my-2">
                      {item.type === "recordatorio" ? "Notificación" : "Solicitud de Orden"}
                    </p>
                    <div className="flex space-x-2 text-gray-400 text-sm">
                      <FaRegUser
                        className="h-5 w-5 cursor-pointer"
                        onClick={() => handleUserClick(item)}
                      />
                      <p
                        className="cursor-pointer"
                        onClick={() => handleUserClick(item)}
                      >
                        {item.usuario ? (item.usuario.username.length > 8 ? `${item.usuario.username.substring(0, 8)}...` : item.usuario.username) : "Desconocido"}
                      </p>
                    </div>
                    <div className="flex space-x-2 text-gray-400 text-sm my-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>{item.fecha.toLocaleDateString()}</p>
                    </div>
                    <div className="border-t-2"></div>
                    <div className="mt-4">
                      {item.type === "recordatorio" ? (
                        <>
                          <p className="text-gray-600 mb-2">
                            <strong>Título:</strong> <br />
                            {item.titulo}
                          </p>
                          <p
                            className="text-gray-600 mb-2 cursor-pointer"
                            onClick={() => handleDescriptionClick(item)}
                          >
                            <strong>Descripción:</strong> <br />
                            {item.descripcion.length > 10 ? `${item.descripcion.substring(0, 8)}...` : item.descripcion}
                          </p>
                          <div className="flex justify-center mt-9">
                            {item.documentoRecordatorio?.length > 0 && (
                              <button
                                className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                                onClick={() => handleOpenFile(item.documentoRecordatorio[0].url)}
                              >
                                Ver Archivo
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            className="text-gray-600 mb-2 cursor-pointer"
                            onClick={() => handleDescriptionClick(item)}
                          >
                            <strong>Orden:</strong> <br /> {item.descripcionOrden.length > 10 ? `${item.descripcionOrden.substring(0, 8)}...` : item.descripcionOrden}
                          </p>
                          <p className="text-gray-600 mb-2">
                            <strong>Maquina Serial:</strong> <br /> {item.nroSerieMaquina}
                          </p>
                          <p className="text-gray-600 mb-2 ">
                            <strong>Ubicación Maquina:</strong> <br />
                            {item.ubicacionMaquina}
                          </p>
                          
                          <p className="text-gray-600  pb-2">
                            <strong>Partes Sobrantes:</strong> 
                            </p>
                            <ul>
                            {item.componenteSobrantes.map((componente, index) => (
            <li key={`${componente.serialComponente}-${index}`}>
              {componente.nombreComponente} <br /> (Serial: {componente.serialComponente})
            </li>
          ))}
                            <li>{item.sobrantes }</li>
                            </ul>
                         
                        </>
                      )}
                      <div className="flex justify-center mt-2 space-x-2">
                        {item.type === "orden" && (
                          <button
                            className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
                            onClick={() => handleAcceptOrder(item)}
                          >
                            Aceptar
                          </button>
                        )}
                        <button
                          className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
                          onClick={() => handleDeleteItem(item._id, item.type)}
                        >
                          Eliminar
                        </button>
                      </div>
                      <div className=" flex justify-center mt-3 ">
                      {item.type === "orden" && (
                        <button 
                        onClick={()=>handleOpenSobrantesModal(item)}
                        className="bg-sky-500 rounded-md py-1 px-4 text-white hover:bg-sky-700 transition-colors duration-300">
                          Sobrantes
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
  
      {/* Modal genérico para mostrar detalles del usuario o recordatorio */}
      {modalVisible && selectedItem && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            <h3 className="text-lg font-bold">
              {selectedItem.type === "usuario" ? "Usuario" : selectedItem.type === "recordatorio" ? "Notificación" : "Solicitud de Orden"}
            </h3>
            <p className="mt-2">
              {selectedItem.content.split("\n").map((line, index) => (
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
  
      {/* Modal para mostrar detalles de la orden */}
      {modalOrdenVisible && selectedItem && (
        <ModalOrden
          orden={selectedItem} // Pasa la orden seleccionada al ModalOrden
          onClose={closeModalOrden} // Añade la función para cerrar el modal
        />
      )}

{showSobrantesModal && (
              <ModalSobrantes
                item={selectedItem}
                onClose={closeSobrantesModal}
                onSave={handleSaveSobrantes} // Actualizar las órdenes al cerrar el modal y pasar la orden actualizada
              />
            )}
      

    </div>
  );
  
};

export default NotificacionesAdmin;
