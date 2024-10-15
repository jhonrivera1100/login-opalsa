import React, { useState, useEffect, useCallback } from "react";
import MaquinaCard from "../components/MaquinaCard";
import CasinoCard from "./CasinoCard";
import CasinoDetail from "../components/CasinoDetail";
import { useMaquinas } from "../context/MaquinasContext";

const SectionContent = ({
  section,
  selectedCasino,
  maquinas,
  casinos,
  selectedBrand,
  cityFilter,
  currentPageMaquinas,
  totalPagesMaquinas,
  currentPageCasinos,
  itemsPerPage,
  handleFilterChange,
  handleCityFilterChange,
  setSelectedCasino,
  setSelectedMaquina,
  handleVerDocumentos,
  abrirDocumento,
  handlePreviousPageMaquinas,
  handleNextPageMaquinas,
  handlePreviousPageCasinos,
  handleNextPageCasinos,
}) => {
  const { buscarMaquinaPorSerieFlexible } = useMaquinas();

  const [searchQueryCasino, setSearchQueryCasino] = useState(""); // Estado para búsqueda de casinos
  const [searchQueryMaquina, setSearchQueryMaquina] = useState(""); // Estado para búsqueda de máquinas en la sección "Maquinas"
  const [filteredMaquinas, setFilteredMaquinas] = useState(maquinas);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual de casinos
  const itemsPerPageCasinos = 12; // Definir 12 casinos por página

  // Efecto para filtrar máquinas en la sección "Maquinas"
  useEffect(() => {
    const fetchFilteredMaquinas = async () => {
      if (section === "Maquinas" && searchQueryMaquina) {
        try {
          const maquinasFiltradas = await buscarMaquinaPorSerieFlexible(
            searchQueryMaquina
          );
          if (maquinasFiltradas) {
            setFilteredMaquinas([maquinasFiltradas]);
          } else {
            setFilteredMaquinas([]);
          }
        } catch (error) {
          console.error("Error buscando máquina:", error);
          setFilteredMaquinas([]); // En caso de error, establecer filteredMaquinas a una lista vacía
        }
      } else {
        setFilteredMaquinas(maquinas);
      }
    };

    fetchFilteredMaquinas();
  }, [searchQueryMaquina, section, maquinas, buscarMaquinaPorSerieFlexible]);

  const renderMaquinas = useCallback(() => {
    if (filteredMaquinas.length === 0) {
      // Mostrar mensaje si no se encuentran máquinas, centrado horizontal y verticalmente
      return (
        <div className="flex justify-center items-center w-full h-64">
          <span className="text-center text-red-600 font-bold text-xl">
            No se encontraron máquinas.
          </span>
        </div>
      );
    }

    return filteredMaquinas.map((maquina) => (
      <MaquinaCard key={maquina._id} maquina={maquina} />
    ));
  }, [filteredMaquinas]);

  const filteredCasinos = useCallback(() => {
    return casinos.filter(
      (casino) =>
        casino.nombreCasino
          .toLowerCase()
          .includes(searchQueryCasino.toLowerCase()) &&
        (cityFilter === "" ||
          casino.ciudadCasino.toLowerCase().includes(cityFilter.toLowerCase()))
    );
  }, [casinos, searchQueryCasino, cityFilter]);

  // Obtener los casinos de la página actual
  const paginatedCasinos = useCallback(() => {
    const filtered = filteredCasinos();
    const startIndex = (currentPage - 1) * itemsPerPageCasinos;
    const endIndex = startIndex + itemsPerPageCasinos;
    return filtered.slice(startIndex, endIndex);
  }, [filteredCasinos, currentPage, itemsPerPageCasinos]);

  const renderCasinos = useCallback(() => {
    const casinosFiltrados = paginatedCasinos();
    if (casinosFiltrados.length === 0) {
      return (
        <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          No se encontraron casinos con ese nombre.
        </p>
      );
    }
    return casinosFiltrados.map((casino) => (
      <CasinoCard
        key={casino._id}
        casino={casino}
        onVerMas={() => {
          if (selectedCasino?._id !== casino._id) {
            setSelectedCasino(casino); // Cambiamos el casino seleccionado
          }
        }}
        onVerDocumentos={() => handleVerDocumentos(casino)}
      />
    ));
  }, [paginatedCasinos, selectedCasino]);

  const totalPagesCasinos = Math.ceil(filteredCasinos().length / itemsPerPageCasinos);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPagesCasinos) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (selectedCasino) {
    return (
      <div className="font-poppins">
        <CasinoDetail
          selectedCasino={selectedCasino}
          filteredMaquinas={maquinas} // Pasamos todas las máquinas
          selectedBrand={selectedBrand}
          handleFilterChange={handleFilterChange}
          abrirDocumento={abrirDocumento}
          setSelectedMaquina={setSelectedMaquina}
          setSelectedCasino={setSelectedCasino}
        />
      </div>
    );
  }

  return (
    <div className="font-poppins mx-auto bg-gray-100 w-11/12 md:w-10/12 h-144 overflow-auto p-4">
      {/* Filtros de máquinas en la sección "Maquinas" */}
      {section === "Maquinas" && (
        <div className="flex flex-wrap justify-center items-center mb-4 w-full">
          <input
            type="text"
            value={searchQueryMaquina}
            onChange={(e) => setSearchQueryMaquina(e.target.value)}
            placeholder="Buscar por número de serie"
            className="px-4 py-2 border rounded-md w-full md:w-1/2 mx-2 mb-2 md:mb-0"
          />
          <select
            value={selectedBrand}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          >
            <option value="">Todas las marcas</option>
            {/* Opciones de marcas */}
          </select>
        </div>
      )}

      {/* Filtros de casinos */}
      {section === "Casinos" && (
        <div className="flex flex-wrap justify-center items-center mb-4 w-full">
          <input
            type="text"
            value={searchQueryCasino}
            onChange={(e) => setSearchQueryCasino(e.target.value)}
            placeholder="Buscar por nombre del casino"
            className="px-4 py-2 border rounded-md w-full md:w-1/2 mx-2 mb-2 md:mb-0"
          />
          <select
            value={cityFilter}
            onChange={handleCityFilterChange}
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          >
            <option value="">Todas las ciudades</option>
            {/* Opciones de ciudades */}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {section === "Maquinas" && renderMaquinas()}
        {section === "Casinos" && renderCasinos()}
      </div>

      {/* Paginación para máquinas */}
      {section === "Maquinas" && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPageMaquinas}
            disabled={currentPageMaquinas === 1}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {currentPageMaquinas} de {totalPagesMaquinas}
          </span>
          <button
            onClick={handleNextPageMaquinas}
            disabled={currentPageMaquinas >= totalPagesMaquinas}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Paginación para casinos */}
      {section === "Casinos" && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPagesCasinos}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPagesCasinos}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(SectionContent);
