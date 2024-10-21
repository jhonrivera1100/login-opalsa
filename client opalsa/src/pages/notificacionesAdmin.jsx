import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import HeaderNotificaciones from "../components/HeaderNotificaciones";
import axios from "../api/axios";
import OrdenCard from "../components/OrdenCard";
import NotificacionesCard from "../components/NotificacionesCard";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/ModalNotificaciones";
import ModalOrden from "../components/ModalFormOrden";
import ModalSobrantes from "../components/ModalSobrantes";
import debounce from "lodash/debounce";

const ITEMS_PER_PAGE = 8; // Número de elementos por página

const NotificacionesAdmin = () => {
  const [combinedItems, setCombinedItems] = useState([]);
  const [searchTermOrdenes, setSearchTermOrdenes] = useState(""); // Buscador para órdenes
  const [selectedDateNotificaciones, setSelectedDateNotificaciones] = useState(""); // Filtro por fecha para notificaciones
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOrdenVisible, setModalOrdenVisible] = useState(false);
  const [showSobrantesModal, setShowSobrantesModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("ordenes"); // Filtro para mostrar órdenes o notificaciones
  const [orderStatusFilter, setOrderStatusFilter] = useState(""); // Filtro por estado de la orden

  // Paginación para Órdenes
  const [currentOrderPage, setCurrentOrderPage] = useState(1); // Página actual para Órdenes
  const [totalOrderPages, setTotalOrderPages] = useState(1); // Total de páginas para Órdenes

  // Paginación para Notificaciones
  const [currentNotiPage, setCurrentNotiPage] = useState(1); // Página actual para Notificaciones
  const [totalNotiPages, setTotalNotiPages] = useState(1); // Total de páginas para Notificaciones

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (filter === "ordenes") {
        fetchOrdenes(currentOrderPage, orderStatusFilter, searchTermOrdenes); // Usar searchTermOrdenes
      } else {
        fetchNotificaciones(currentNotiPage, selectedDateNotificaciones); // Usar selectedDateNotificaciones
      }
    }
  }, [
    isAuthenticated,
    filter,
    currentOrderPage,
    currentNotiPage,
    orderStatusFilter,
    searchTermOrdenes,
    selectedDateNotificaciones,
  ]);

  // Fetch para Órdenes
  const fetchOrdenes = async (page = 1, estadoOrden = "", searchTerm = "") => {
    try {
      const response = await axios.get("/ordenes", {
        params: { page, limit: ITEMS_PER_PAGE, estadoOrden, searchTerm },
      });

      const { ordenes, totalPages } = response.data;
      const formattedOrdenes = ordenes.map((orden) => ({
        ...orden,
        type: "orden",
        fecha: new Date(orden.fechaOrden),
        descripcionOrden: orden.descripcionOrden || "",
        estadoOrden: orden.estadoOrden,
        maquina: orden.maquina || {},
        numeroOrden: orden.numeroOrden,
      }));

      setCombinedItems(formattedOrdenes);
      setTotalOrderPages(totalPages);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  };

  // Fetch para Notificaciones con filtro de fecha
  const fetchNotificaciones = async (page = 1, selectedDate = "") => {
    try {
      const response = await axios.get("/recordatorios", {
        params: { page, limit: ITEMS_PER_PAGE, fechaRecordatorio: selectedDate }, // Filtro por fecha
      });

      const { recordatorios, totalPages } = response.data;
      const formattedRecordatorios = recordatorios.map((recordatorio) => ({
        ...recordatorio,
        type: "recordatorio",
        fecha: new Date(recordatorio.fechaRecordatorio),
        descripcion: recordatorio.descripcion || "",
      }));

      setCombinedItems(formattedRecordatorios);
      setTotalNotiPages(totalPages);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  // Manejar cambios en el filtro de fecha de notificaciones
  const handleDateChangeNotificaciones = (e) => {
    setSelectedDateNotificaciones(e.target.value);
    setCurrentNotiPage(1); // Reiniciar a la primera página cuando se cambia la búsqueda por fecha
  };

  // Manejar cambios en el buscador de órdenes
  const handleSearchChangeOrdenes = (e) => {
    setSearchTermOrdenes(e.target.value);
    setCurrentOrderPage(1); // Reiniciar a la primera página cuando se cambia la búsqueda
  };

  // Filtrar por tipo (órdenes o notificaciones)
  const filteredByState = combinedItems.filter((item) => {
    if (filter === "ordenes") return item.type === "orden";
    if (filter === "notificaciones") return item.type === "recordatorio";
    return false;
  });

  const handleDescriptionClick = (item) => {
    setSelectedItem({
      type: item.type,
      content:
        item.descripcion || item.descripcionOrden || "No hay descripción disponible",
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
  const handleAbrirModalOrder = (item) => {
    setSelectedItem(item);
    setModalOrdenVisible(true);
  };

  const handleAcceptOrder = async (item) => {
    // Actualización optimista
    setCombinedItems((prevItems) =>
        prevItems.map((orden) =>
            orden._id === item._id ? { ...orden, estadoOrden: 'Orden aprobada' } : orden
        )
    );
};

const handleFinalizarOrder = (item) => {
  // Actualización directa en el frontend
  setCombinedItems((prevItems) =>
      prevItems.map((orden) =>
          orden._id === item._id ? { ...orden, estadoOrden: 'Orden finalizada' } : orden
      )
  );
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
      setCombinedItems((prevItems) => prevItems.filter((item) => item._id !== id));
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

  // Paginación para Órdenes
  const handlePreviousOrderPage = () => {
    if (currentOrderPage > 1) {
      setCurrentOrderPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextOrderPage = () => {
    if (currentOrderPage < totalOrderPages) {
      setCurrentOrderPage((prevPage) => prevPage + 1);
    }
  };

  // Paginación para Notificaciones
  const handlePreviousNotiPage = () => {
    if (currentNotiPage > 1) {
      setCurrentNotiPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextNotiPage = () => {
    if (currentNotiPage < totalNotiPages) {
      setCurrentNotiPage((prevPage) => prevPage + 1);
    }
  };

  const handleOrderStatusFilterChange = (e) => {
    setOrderStatusFilter(e.target.value);
    setCurrentOrderPage(1);
  };

  // Reiniciar las páginas al cambiar de sección (órdenes o notificaciones)
  const handleSectionChange = (section) => {
    setFilter(section);
    if (section === "ordenes") {
      setCurrentOrderPage(1);
    } else {
      setCurrentNotiPage(1);
    }
  };

  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen font-poppins">
      <Sidebar />
      <div className="lg:col-span-3 xl:col-span-5 p-4 lg:p-8">
        <div className="mb-4 flex flex-col lg:flex-row lg:justify-between">
          <HeaderNotificaciones />
        </div>

        <div className="mb-4 flex flex-wrap justify-center gap-4 pt-4 lg:pt-10">
          <button
            className={`px-4 py-2 rounded-lg ${filter === "ordenes" ? "bg-green-600 text-white" : "bg-gray-300"}`}
            onClick={() => handleSectionChange("ordenes")}
          >
            Órdenes
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${filter === "notificaciones" ? "bg-orange-600 text-white" : "bg-gray-300"}`}
            onClick={() => handleSectionChange("notificaciones")}
          >
            Notificaciones
          </button>
        </div>

        {/* Filtro por estado de la orden como lista desplegable y el buscador */}
        {filter === "ordenes" && (
          <div className="mb-4 flex justify-center gap-4">
            <div>
              <label className="block text-gray-700">Filtrar por estado:</label>
              <select
                className="px-4 py-2 border rounded-lg bg-gray-200"
                value={orderStatusFilter}
                onChange={handleOrderStatusFilterChange}
              >
                <option value="">Todas las Órdenes</option>
                <option value="Orden aprobada">Orden Aprobada</option>
                <option value="Orden en solicitud">Orden en Solicitud</option>
                <option value="Orden finalizada">Orden finalizada</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Buscar orden:</label>
              <input
                type="text"
                placeholder="Buscar por número de orden o usuario"
                className="px-4 py-2 border rounded-lg w-full sm:w-[300px] md:w-[400px]"
                value={searchTermOrdenes}
                onChange={handleSearchChangeOrdenes}
              />
            </div>
          </div>
        )}

        {filter === "notificaciones" && (
          <div className="mb-4 flex justify-center gap-4">
            <div>
              <label className="block text-gray-700">Filtrar por fecha:</label>
              <input
                type="date"
                placeholder="Filtrar por fecha"
                className="px-4 py-2 border rounded-lg w-full sm:w-[300px] md:w-[400px]"
                value={selectedDateNotificaciones}
                onChange={handleDateChangeNotificaciones}
              />
            </div>
          </div>
        )}

        <div className="w-full pt-6">
          <div className="h-[640px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredByState.map((item) =>
                item.type === "orden" ? (
                  <OrdenCard
                    key={item._id}
                    item={item}
                    handleDescriptionClick={handleDescriptionClick}
                    handleUserClick={handleUserClick}
                    handleAcceptOrder={handleAcceptOrder}
                    handleAbrirModalOrder={handleAbrirModalOrder}
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

        {/* Botones de paginación */}
        {filter === "ordenes" ? (
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded mr-2"
              onClick={handlePreviousOrderPage}
              disabled={currentOrderPage === 1}
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {currentOrderPage} de {totalOrderPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded ml-2"
              onClick={handleNextOrderPage}
              disabled={currentOrderPage >= totalOrderPages}
            >
              Siguiente
            </button>
          </div>
        ) : (
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded mr-2"
              onClick={handlePreviousNotiPage}
              disabled={currentNotiPage === 1}
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-700">
              Página {currentNotiPage} de {totalNotiPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded ml-2"
              onClick={handleNextNotiPage}
              disabled={currentNotiPage >= totalNotiPages}
            >
              Siguiente
            </button>
          </div>
        )}
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
          handleAcceptOrder={handleAcceptOrder}
        />
      )}
      {showSobrantesModal && selectedItem && (
        <ModalSobrantes
          visible={showSobrantesModal}
          onClose={closeSobrantesModal}
          item={selectedItem}
          onSave={handleSaveSobrantes}
          handleFinalizarOrder={handleFinalizarOrder}
        />
      )}
    </div>
  );
};

export default NotificacionesAdmin;
