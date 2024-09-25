import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import OrdenCard from "../components/OrdenCard";
import NotificacionesCard from "../components/NotificacionesCard";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ModalNotificaciones";
import ModalOrden from "../components/ModalFormOrden";
import ModalSobrantes from "../components/ModalSobrantes";
import debounce from "lodash/debounce";

const NotificacionesAdmin = () => {
  const [combinedItems, setCombinedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOrdenVisible, setModalOrdenVisible] = useState(false);
  const [showSobrantesModal, setShowSobrantesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [recordatoriosResponse, ordenesResponse] = await Promise.all([
        axios.get("/recordatorios"),
        axios.get("/ordenes"),
      ]);

      const recordatorios = recordatoriosResponse.data.map((recordatorio) => ({
        ...recordatorio,
        type: "recordatorio",
        fecha: new Date(recordatorio.fechaRecordatorio),
        descripcion: recordatorio.descripcion || "",
      }));

      const ordenes = ordenesResponse.data.map((orden) => ({
        ...orden,
        type: "orden",
        fecha: new Date(orden.fechaOrden),
        descripcionOrden: orden.descripcionOrden || "",
        estadoOrden: orden.estadoOrden,
        maquina: orden.maquina || {}, // Asegúrate de incluir el objeto de la máquina
      }));

      const combinedItems = [...recordatorios, ...ordenes];
      combinedItems.sort((a, b) => b.fecha - a.fecha);

      setCombinedItems(combinedItems);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = combinedItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchDescription =
      (item.descripcion && item.descripcion.toLowerCase().includes(term)) ||
      (item.descripcionOrden &&
        item.descripcionOrden.toLowerCase().includes(term));
    const matchMaquinaSerial =
      item.type === "orden" &&
      item.maquina.nroSerieMaquina &&
      item.maquina.nroSerieMaquina.toLowerCase().includes(term);
    const matchUbicacion =
      item.type === "orden" &&
      item.maquina.ubicacionMaquina &&
      item.maquina.ubicacionMaquina.toLowerCase().includes(term);
    const matchUsuario =
      item.type === "orden" &&
      item.usuario &&
      item.usuario.username &&
      item.usuario.username.toLowerCase().includes(term);

    return (
      matchDescription || matchMaquinaSerial || matchUbicacion || matchUsuario
    );
  });

  const filteredByState = filteredItems.filter((item) => {
    if (filter === "all") return true;
    if (item.type === "orden" && filter !== "notificaciones") {
      return item.estadoOrden === filter;
    }
    if (filter === "notificaciones" && item.type === "recordatorio") {
      return true;
    }
    return false;
  });

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
    setSelectedItem(item);
    setModalOrdenVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const closeModalOrden = () => {
    setModalOrdenVisible(false);
    setSelectedItem(null);
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
        const response = await axios.patch(`/recordatorios/${id}/visto`, {
          visto: !visto,
        });
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
        const response = await axios.patch(`/ordenes/${id}/aceptar`, {
          aceptado: !aceptar,
        });
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
    }, 50),
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
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen font-poppins">
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
        <div className="mb-4 flex flex-wrap justify-center gap-4 pt-4 lg:pt-10">
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "Orden en solicitud"
                ? "bg-yellow-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setFilter("Orden en solicitud")}
          >
            Ordenes Solicitadas
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "Orden aprobada"
                ? "bg-blue-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setFilter("Orden aprobada")}
          >
            Ordenes Aprobadas
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "Orden Finalizada"
                ? "bg-red-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setFilter("Orden Finalizada")}
          >
            Ordenes Finalizadas
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "notificaciones"
                ? "bg-orange-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => setFilter("notificaciones")}
          >
            Notificaciones
          </button>
        </div>

        <div className="w-full pt-6">
          <div className="h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredByState.map((item) =>
                item.type === "orden" ? (
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
                ) : (
                  <NotificacionesCard
                    key={item._id}
                    recordatorio={item}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDelete={handleDeleteItem}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
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
          </div>
        </Modal>
      )}
      {modalOrdenVisible && selectedItem && (
        <ModalOrden
          visible={modalOrdenVisible}
          onClose={closeModalOrden}
          orden={selectedItem}
          handleSave={fetchData}
        />
      )}
      {showSobrantesModal && selectedItem && (
        <ModalSobrantes
          visible={showSobrantesModal}
          onClose={closeSobrantesModal}
          item={selectedItem}
          onSave={handleSaveSobrantes}
        />
      )}
    </div>
  );
};

export default NotificacionesAdmin;
