import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import MovimientoMaquinaCard from "../components/MovimientoMaquinaCard";
import Modal from "../components/modalMantenimiento";

const ITEMS_PER_PAGE = 8;

const Historial = () => {
  const [items, setItems] = useState([]);  // Estado general para almacenar los datos
  const [filteredItems, setFilteredItems] = useState([]);  // Elementos filtrados para renderización
  const [filter, setFilter] = useState("mantenimiento");  // Filtro para secciones
  const [searchQuery, setSearchQuery] = useState("");  // Para la búsqueda por número de serie o código de elemento
  const [currentPage, setCurrentPage] = useState(1);  // Página actual
  const [totalPages, setTotalPages] = useState(1);  // Total de páginas
  const [selectedDate, setSelectedDate] = useState("");  // Filtro de fecha
  const [selectedDescription, setSelectedDescription] = useState("");  // Descripción modal
  const [isModalOpen, setIsModalOpen] = useState(false);  // Estado modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        // Filtrar mantenimientos por número de serie o por fecha
        if (filter === "mantenimiento") {
          response = await axios.get("http://localhost:4000/api/mantenimientos", {
            params: {
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              nroSerieMaquina: searchQuery,
              fechaMantenimiento: selectedDate,
            }
          });
        } else if (filter === "movimiento") {
          response = await axios.get("http://localhost:4000/api/movimientos", {
            params: {
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              serialComponente: searchQuery,
              fechaTransferencia: selectedDate,
            }
          });
        } else if (filter === "moviMaquina") {
          response = await axios.get("http://localhost:4000/api/moviMaquinas", {
            params: {
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              serialMaquina: searchQuery,
              fechaTransferencia: selectedDate,
            }
          });
        } else if (filter === "movimientoElemento") {
          response = await axios.get("http://localhost:4000/api/movimientos-elementos", {
            params: {
              page: currentPage,
              limit: ITEMS_PER_PAGE,
              codigoElemento: searchQuery,  // Búsqueda por código de elemento
              fechaTransferenciaElm: selectedDate,  // Filtro por fecha de transferencia
            }
          });
        }

        const { mantenimientos, movimientos, movimientosMaquina, movimientosElementos, totalPages } = response.data;
        setItems(mantenimientos || movimientos || movimientosMaquina || movimientosElementos || []);
        setFilteredItems(mantenimientos || movimientos || movimientosMaquina || movimientosElementos || []);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();  // Llamar a fetchData cada vez que el filtro, la página, la búsqueda o la fecha cambien
  }, [filter, currentPage, searchQuery, selectedDate]);

  const deleteItem = async (id, type) => {
    try {
      if (type === "mantenimiento") {
        await axios.delete(`http://localhost:4000/api/mantenimientos/${id}`);
      } else if (type === "movimiento") {
        await axios.delete(`http://localhost:4000/api/movimientos/${id}`);
      } else if (type === "moviMaquina") {
        await axios.delete(`http://localhost:4000/api/moviMaquinas/${id}`);
      } else if (type === "movimientoElemento") {
        await axios.delete(`http://localhost:4000/api/movimientos-elementos/${id}`);
      }

      setItems(prevItems => prevItems.filter(item => item._id !== id));
      setFilteredItems(prevFilteredItems => prevFilteredItems.filter(item => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setCurrentPage(1);  // Reiniciar a la primera página en la búsqueda
  };

  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);
    setCurrentPage(1);  // Reiniciar a la primera página en el filtro por fecha
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSearchQuery("");  // Limpiar búsqueda al cambiar de filtro
    setSelectedDate("");  // Limpiar fecha al cambiar de filtro
    setCurrentPage(1);  // Reiniciar a la primera página cada vez que cambie la sección
  };

  return (
    <div className="font-poppins">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 p-6 pl-[75px]">
        <div className="flex flex-wrap justify-center mb-4 space-x-2 space-y-2 md:space-y-0">
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${filter === "mantenimiento" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleFilterChange("mantenimiento")}
          >
            Mantenimientos
          </button>
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${filter === "movimiento" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleFilterChange("movimiento")}
          >
            Movimientos de Componentes
          </button>
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${filter === "moviMaquina" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleFilterChange("moviMaquina")}
          >
            Movimientos de Máquinas
          </button>
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${filter === "movimientoElemento" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
            onClick={() => handleFilterChange("movimientoElemento")}
          >
            Movimientos de Elementos
          </button>
        </div>

        <div className="flex justify-center mb-9 pt-7">
          <input
            type="text"
            className="px-4 py-2 border rounded w-[500px]"
            placeholder={"Buscar por código o numero de serie"}
            value={searchQuery}
            onChange={handleSearch}
          />
          <input
            type="date"
            className="px-4 py-2 border rounded mx-4"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MovimientoMaquinaCard
                key={item._id}
                item={item}
                handleDescriptionClick={handleDescriptionClick}
                deleteItem={deleteItem}
              />
            ))
          ) : (
            <p>No se encontraron resultados</p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="mx-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="mx-2 px-4 py-2 text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="mx-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold">Descripción Completa</h2>
          <p>{selectedDescription}</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Historial;
