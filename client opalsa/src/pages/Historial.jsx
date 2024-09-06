import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import MovimientoMaquinaCard from "../components/MovimientoMaquinaCard";
import Modal from "../components/modalMantenimiento";

const ITEMS_PER_PAGE = 8;

const Historial = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [dateFilter, setDateFilter] = useState("recent");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mantenimientosResponse = await axios.get(
          "http://localhost:4000/api/mantenimientos"
        );
        const movimientosResponse = await axios.get(
          "http://localhost:4000/api/movimientos"
        );
        const moviMaquinasResponse = await axios.get(
          "http://localhost:4000/api/moviMaquinas"
        );

        const mantenimientosWithDetails = await Promise.all(
          mantenimientosResponse.data.map(async (mantenimiento) => {
            if (mantenimiento.nroSerieMaquina) {
              try {
                const machineResponse = await axios.get(
                  `http://localhost:4000/api/maquinas/${mantenimiento.nroSerieMaquina}`
                );
                return {
                  ...mantenimiento,
                  nombreMaquina: machineResponse.data.nombreMaquina,
                  ubicacionMaquina: machineResponse.data.ubicacionMaquina,
                  type: "mantenimiento",
                  fecha: new Date(mantenimiento.fechaMantenimiento),
                };
              } catch (error) {
                return {
                  ...mantenimiento,
                  type: "mantenimiento",
                  fecha: new Date(mantenimiento.fechaMantenimiento),
                };
              }
            } else {
              return {
                ...mantenimiento,
                type: "mantenimiento",
                fecha: new Date(mantenimiento.fechaMantenimiento),
              };
            }
          })
        );

        const movimientosWithDetails = movimientosResponse.data.map(
          (movimiento) => ({
            ...movimiento,
            type: "movimiento",
            fecha: new Date(movimiento.fechaTransferencia),
          })
        );

        const moviMaquinasWithDetails = moviMaquinasResponse.data.map(
          (moviMaquina) => ({
            ...moviMaquina,
            type: "moviMaquina",
            fecha: new Date(moviMaquina.fechaTransferencia),
          })
        );

        const combinedItems = [
          ...mantenimientosWithDetails,
          ...movimientosWithDetails,
          ...moviMaquinasWithDetails,
        ];

        combinedItems.sort((a, b) => b.fecha - a.fecha);

        setItems(combinedItems);
        setFilteredItems(combinedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const deleteItem = async (id, type) => {
    try {
      if (type === "mantenimiento") {
        await axios.delete(`http://localhost:4000/api/mantenimientos/${id}`);
      } else if (type === "movimiento") {
        await axios.delete(`http://localhost:4000/api/movimientos/${id}`);
      } else if (type === "moviMaquina") {
        await axios.delete(`http://localhost:4000/api/moviMaquinas/${id}`);
      }
      setItems(items.filter((item) => item._id !== id));
      setFilteredItems(filteredItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    let filtered = items;

    if (filter !== "all") {
      filtered = items.filter((item) => item.type === filter);
    }

    if (query) {
      if (filter === "all") {
        filtered = filtered.filter((item) =>
          item.fecha.toLocaleDateString().includes(query)
        );
      } else {
        if (filter === "mantenimiento") {
          filtered = filtered.filter((item) =>
            item.nroSerieMaquina.toLowerCase().includes(query)
          );
        } else if (filter === "movimiento") {
          filtered = filtered.filter((item) =>
            item.serialComponente.toLowerCase().includes(query)
          );
        } else if (filter === "moviMaquina") {
          filtered = filtered.filter((item) =>
            item.serialMaquina.toLowerCase().includes(query)
          );
        }
      }
    }

    setFilteredItems(filtered);
    setCurrentPage(0); // Reset to first page on search
  };

  useEffect(() => {
    let filtered = items;

    if (filter !== "all") {
      filtered = items.filter((item) => item.type === filter);
    }

    if (searchQuery) {
      if (filter === "all") {
        filtered = filtered.filter((item) =>
          item.fecha.toLocaleDateString().includes(searchQuery)
        );
      } else {
        if (filter === "mantenimiento") {
          filtered = filtered.filter((item) =>
            item.nroSerieMaquina.toLowerCase().includes(searchQuery)
          );
        } else if (filter === "movimiento") {
          filtered = filtered.filter((item) =>
            item.serialComponente.toLowerCase().includes(searchQuery)
          );
        } else if (filter === "moviMaquina") {
          filtered = filtered.filter((item) =>
            item.serialMaquina.toLowerCase().includes(searchQuery)
          );
        }
      }
    }

    // Filtrado por fecha
    if (dateFilter === "recent") {
      filtered.sort((a, b) => b.fecha - a.fecha);
    } else if (dateFilter === "oldest") {
      filtered.sort((a, b) => a.fecha - b.fecha);
    }

    setFilteredItems(filtered);
    setCurrentPage(0); // Reset to first page on filter change
  }, [filter, items, searchQuery, dateFilter]);

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      startIndex + ITEMS_PER_PAGE < filteredItems.length
        ? prevPage + 1
        : prevPage
    );
  };

  const handleDescriptionClick = (description) => {
    setSelectedDescription(description);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
      <header className="flex items-center justify-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          MANTENIMIENTOS
          <span className="text-sidebar-100 drop-shadow-xl">
            {" "}
            Y MOVIMIENTOS
          </span>
        </h1>
      </header>
      <div className="max-w-7xl mx-auto mt-5 p-6 pl-[75px]">
        <div className="flex flex-wrap justify-center mb-4 space-x-2 space-y-2 md:space-y-0">
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            Todos
          </button>
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${
              filter === "mantenimiento"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setFilter("mantenimiento")}
          >
            Mantenimientos
          </button>
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${
              filter === "movimiento" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("movimiento")}
          >
            Movimientos de Componentes
          </button>
          <button
            className={`w-full sm:w-auto mx-2 px-4 py-2 rounded ${
              filter === "moviMaquina"
                ? "bg-yellow-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setFilter("moviMaquina")}
          >
            Movimientos de Máquinas
          </button>
        </div>
        <div className="flex justify-center mb-9 pt-7">
          <input
            type="text"
            className="px-4 py-2 border rounded w-[500px]"
            placeholder={
              filter === "all"
                ? "Buscar por fecha (D/M/AAAA)"
                : "Buscar por numero de serie o fecha (D/M/AAAA)"
            }
            value={searchQuery}
            onChange={handleSearch}
          />
          <select
            className="px-4 py-2 border rounded"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="recent">Más Antiguos</option>
            <option value="oldest">Más Recientes</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {currentItems.map((item) => (
            <MovimientoMaquinaCard
              key={item._id}
              item={item}
              handleDescriptionClick={handleDescriptionClick}
              deleteItem={deleteItem}
            />
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="mx-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <button
            className="mx-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handleNextPage}
            disabled={startIndex + ITEMS_PER_PAGE >= filteredItems.length}
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