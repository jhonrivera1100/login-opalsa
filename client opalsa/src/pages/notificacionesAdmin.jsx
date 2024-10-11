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
  const [searchTerm, setSearchTerm] = useState("");
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
        fetchOrdenes(currentOrderPage, orderStatusFilter); // Llamar a fetchOrdenes cuando estamos en Órdenes
      } else {
        fetchNotificaciones(currentNotiPage); // Llamar a fetchNotificaciones cuando estamos en Notificaciones
      }
    }
  }, [isAuthenticated, filter, currentOrderPage, currentNotiPage, orderStatusFilter]);

  // Fetch para Órdenes
  const fetchOrdenes = async (page = 1, estadoOrden = "") => {
    try {
      const response = await axios.get("/ordenes", {
        params: { page, limit: ITEMS_PER_PAGE, estadoOrden },
      });

      const { ordenes, totalPages } = response.data;
      const formattedOrdenes = ordenes.map((orden) => ({
        ...orden,
        type: "orden",
        fecha: new Date(orden.fechaOrden),
        descripcionOrden: orden.descripcionOrden || "",
        estadoOrden: orden.estadoOrden,
        maquina: orden.maquina || {}, // Incluir el objeto de la máquina
      }));

      setCombinedItems(formattedOrdenes);
      setTotalOrderPages(totalPages); // Actualizamos el total de páginas para Órdenes
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  };

  // Fetch para Notificaciones
  const fetchNotificaciones = async (page = 1) => {
    try {
      const response = await axios.get("/recordatorios", {
        params: { page, limit: ITEMS_PER_PAGE }, // Paginación para notificaciones
      });

      const { recordatorios, totalPages } = response.data;
      const formattedRecordatorios = recordatorios.map((recordatorio) => ({
        ...recordatorio,
        type: "recordatorio",
        fecha: new Date(recordatorio.fechaRecordatorio),
        descripcion: recordatorio.descripcion || "",
      }));

      setCombinedItems(formattedRecordatorios);
      setTotalNotiPages(totalPages); // Actualizamos el total de páginas para Notificaciones
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
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

  // Filtrar por tipo (órdenes o notificaciones)
  const filteredByState = filteredItems.filter((item) => {
    if (filter === "ordenes") return item.type === "orden";
    if (filter === "notificaciones") return item.type === "recordatorio";
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
    setOrderStatusFilter(e.target.value); // Cambiar el filtro por estado de la orden
    setCurrentOrderPage(1); // Reiniciar a la primera página al cambiar el filtro
  };

  // Reiniciar las páginas al cambiar de sección (órdenes o notificaciones)
  const handleSectionChange = (section) => {
    setFilter(section);
    if (section === "ordenes") {
      setCurrentOrderPage(1); // Resetear la página de órdenes a 1
    } else {
      setCurrentNotiPage(1); // Resetear la página de notificaciones a 1
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
            className={`px-4 py-2 rounded-lg ${
              filter === "ordenes" ? "bg-green-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => handleSectionChange("ordenes")}
          >
            Órdenes
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filter === "notificaciones"
                ? "bg-orange-600 text-white"
                : "bg-gray-300"
            }`}
            onClick={() => handleSectionChange("notificaciones")}
          >
            Notificaciones
          </button>
        </div>

        {/* Filtro por estado de la orden como lista desplegable */}
        {filter === "ordenes" && (
          <div className="mb-4 flex justify-center">
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
        )}

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
