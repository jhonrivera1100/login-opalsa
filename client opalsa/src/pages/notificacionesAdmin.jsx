import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import OrdenCard from "../components/OrdenCard";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ModalNotificaciones";
import ModalOrden from "../components/ModalFormOrden"; // Importa el ModalOrden
import { FaRegUser } from "react-icons/fa";
import { GoDiscussionClosed } from "react-icons/go";
import { BsFileEarmarkText } from "react-icons/bs";
import debounce from "lodash/debounce";
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
        axios.get("/ordenes"),
      ]);

      const combinedItems = [
        ...recordatoriosResponse.data.map((recordatorio) => ({
          ...recordatorio,
          type: "recordatorio",
          fecha: new Date(recordatorio.fechaRecordatorio),
          descripcion: recordatorio.descripcion || "",
        })),
        ...ordenesResponse.data.map((orden) => ({
          ...orden,
          type: "orden",
          fecha: new Date(orden.fechaOrden),
          descripcionOrden: orden.descripcionOrden || "",
        })),
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

  const filteredItems = combinedItems.filter(
    (item) =>
      (item.descripcion &&
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.descripcionOrden &&
        item.descripcionOrden.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDescriptionClick = (item) => {
    setSelectedItem({
      type: item.type,
      content:
        item.descripcion ||
        item.descripcionOrden ||
        "No hay descripción disponible",
    });
    setModalVisible(true);
  };

  const handleUserClick = (item) => {
    setSelectedItem({
      type: "usuario",
      content: item.usuario ? item.usuario.username : "Desconocido",
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
    window.open(url, "_blank");
  };

  const handleDeleteItem = async (id, type) => {
    try {
      if (type === "recordatorio") {
        await axios.delete(`/recordatorios/${id}`);
      } else if (type === "orden") {
        await axios.delete(`/ordenes/${id}`);
      }
      setCombinedItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  const handleCheckboxChange = useCallback(
    debounce(async (id, visto) => {
      try {
        console.log(`Actualizando recordatorio ${id} a visto: ${!visto}`);
        const response = await axios.patch(`/recordatorios/${id}/visto`, {
          visto: !visto,
        });
        console.log("Respuesta del servidor:", response.data);
        setCombinedItems((prevItems) =>
          prevItems.map((item) =>
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
        const response = await axios.patch(`/ordenes/${id}/aceptar`, {
          aceptado: !aceptar,
        });
        console.log("Respuesta del servidor:", response.data);

        // Actualiza el estado local con la respuesta del servidor
        setCombinedItems((prevItems) =>
          prevItems.map((item) =>
            item._id === id
              ? { ...item, aceptado: response.data.aceptado }
              : item
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
    setCombinedItems((prevItems) =>
      prevItems.map((item) =>
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
                <OrdenCard
                  key={item._id}
                  item={item}
                  handleCheckboxAceptar={handleCheckboxAceptar}
                  handleDescriptionClick={handleDescriptionClick}
                  handleUserClick={handleUserClick}
                  handleAcceptOrder={handleAcceptOrder}
                  handleDeleteItem={handleDeleteItem}
                  handleOpenSobrantesModal={handleOpenSobrantesModal}
                />
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
              {selectedItem.type === "usuario"
                ? "Usuario"
                : selectedItem.type === "recordatorio"
                ? "Notificación"
                : "Solicitud de Orden"}
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
