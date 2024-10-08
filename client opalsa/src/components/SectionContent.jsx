import React, { useState, useEffect, useCallback } from "react";
import MaquinaCard from "../components/MaquinaCard";
import CasinoCard from "./CasinoCard";
import CasinoDetail from "../components/CasinoDetail";
import { useMaquinas } from "../context/MaquinasContext"; // Importamos el contexto

const SectionContent = ({
  section,
  selectedCasino,
  maquinas, // Ya no se usará directamente para filtrar por serie
  casinos,
  searchQuery,
  selectedBrand,
  cityFilter,
  currentPageMaquinas,
  totalPagesMaquinas,
  currentPageCasinos,
  itemsPerPage,
  handleSearch,
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
  const { buscarMaquinaPorSerieFlexible } = useMaquinas(); // Hook para acceder a la función de búsqueda flexible

  const [filteredMaquinas, setFilteredMaquinas] = useState(maquinas); // Estado local para almacenar máquinas filtradas

  // Efecto para buscar máquinas por número de serie en el backend cuando cambia el query
  useEffect(() => {
    const fetchFilteredMaquinas = async () => {
      if (section === "Maquinas" && searchQuery) {
        const maquinasFiltradas = await buscarMaquinaPorSerieFlexible(
          searchQuery
        ); // Eliminado el parámetro exactSearch
        if (maquinasFiltradas) {
          setFilteredMaquinas([maquinasFiltradas]); // Guardar la máquina encontrada
        } else {
          setFilteredMaquinas([]); // Si no se encuentra nada, lista vacía
        }
      } else {
        setFilteredMaquinas(maquinas); // Resetear las máquinas si no hay búsqueda activa
      }
    };

    fetchFilteredMaquinas();
  }, [searchQuery, section, maquinas, buscarMaquinaPorSerieFlexible]);

  // Renderizado de las tarjetas de máquinas usando las filtradas del backend
  const renderMaquinas = useCallback(() => {
    return filteredMaquinas.map((maquina) => (
      <MaquinaCard key={maquina._id} maquina={maquina} />
    ));
  }, [filteredMaquinas]);

  // Memoizamos los casinos filtrados basados en los filtros de búsqueda y ciudad
  const filteredCasinos = useCallback(() => {
    return casinos.filter(
      (casino) =>
        casino.nombreCasino.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (cityFilter === "" ||
          casino.ciudadCasino.toLowerCase().includes(cityFilter.toLowerCase()))
    );
  }, [casinos, searchQuery, cityFilter]);

  const renderCasinos = useCallback(() => {
    return filteredCasinos().map((casino) => (
      <CasinoCard
        key={casino._id}
        casino={casino}
        onVerMas={() => {
          if (selectedCasino?._id !== casino._id) {
            // Prevenir múltiples selecciones del mismo casino
            setSelectedCasino(casino);
          }
        }}
        onVerDocumentos={() => handleVerDocumentos(casino)}
      />
    ));
  }, [filteredCasinos, selectedCasino]);

  if (selectedCasino) {
    return (
      <div className="font-poppins">
        <CasinoDetail
          selectedCasino={selectedCasino}
          filteredMaquinas={filteredMaquinas}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
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
      {/* Filtros de máquinas */}
      {section === "Maquinas" && (
        <div className="flex flex-wrap justify-center items-center mb-4 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Buscar por número de serie"
            className="px-4 py-2 border rounded-md w-full md:w-1/2 mx-2 mb-2 md:mb-0"
          />
          <select
            value={selectedBrand}
            onChange={handleFilterChange} // Mantiene la lógica para actualizar la marca seleccionada
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          >
            <option value="">Todas las marcas</option>
            <option value="AINSWORTH">AINSWORTH</option>
            <option value="NOVOMATIC">NOVOMATIC</option>
            <option value="WILLIAMS">WILLIAMS</option>
            <option value="IGT">IGT</option>
            <option value="GOLD CLUB">GOLD CLUB</option>
            <option value="R FRANCO">R FRANCO</option>
            <option value="HOTBOX">HOTBOX</option>
            <option value="BALLY">BALLY</option>
            <option value="SPIELO">SPIELO</option>
            <option value="ZITRO">ZITRO</option>
            <option value="POKER">POKER</option>
            <option value="ALFA STREET">ALFA STREET</option>
            <option value="MERKUR">MERKUR</option>
            <option value="GTS">GTS</option>
            <option value="KONAMI">KONAMI</option>
            <option value="ARISTOCRAT">ARISTOCRAT</option>
          </select>
        </div>
      )}

      {/* Filtros de casinos */}
      {section === "Casinos" && (
        <div className="flex flex-wrap justify-center items-center mb-4 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Buscar por nombre del casino"
            className="px-4 py-2 border rounded-md w-full md:w-1/2 mx-2 mb-2 md:mb-0"
          />
          <select
            value={cityFilter}
            onChange={handleCityFilterChange}
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          >
            <option value="">Todas las ciudades</option>
            <option value="Cali">Cali</option>
            <option value="Popayan">Popayan</option>
            <option value="Pasto">Pasto</option>
            <option value="Tulua">Tulua</option>
          </select>
        </div>
      )}

      {/* Renderizado de las tarjetas de máquinas o casinos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {section === "Maquinas" && renderMaquinas()}
        {section === "Casinos" && renderCasinos()}
      </div>

      {/* Controles de paginación para máquinas */}
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

      {/* Controles de paginación para casinos */}
      {section === "Casinos" && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPageCasinos}
            disabled={currentPageCasinos === 1}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={handleNextPageCasinos}
            disabled={
              currentPageCasinos * itemsPerPage >= filteredCasinos().length
            }
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
