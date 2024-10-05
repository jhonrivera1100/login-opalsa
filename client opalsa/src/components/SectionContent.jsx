import React, { useMemo, useCallback } from "react";
import MaquinaCard from "../components/MaquinaCard";
import CasinoCard from "./CasinoCard";
import CasinoDetail from "../components/CasinoDetail";

const SectionContent = ({
  section,
  selectedCasino,
  maquinas,
  casinos,
  searchQuery,
  selectedBrand,
  cityFilter,
  currentPageMaquinas,
  totalPagesMaquinas, // Añadido para controlar la cantidad total de páginas
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
  // Memoizamos las máquinas filtradas dependiendo de la sección
  const filteredMaquinas = useMemo(() => {
    // Si estamos en la sección de Casinos, se aplican los filtros por casino seleccionado
    if (section === "Casinos" && selectedCasino) {
      return maquinas.filter((maquina) => {
        const maquinaUbicacion = maquina.ubicacionMaquina || "";
        const maquinaNombre = maquina.nombreMaquina || "";
        const maquinaSerie = maquina.nroSerieMaquina || "";

        return (
          maquinaUbicacion === selectedCasino.nombreCasino &&
          (maquinaNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            maquinaSerie.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (selectedBrand === "" || maquina.marcaMaquina === selectedBrand)
        );
      });
    }
    
    // Si estamos en la sección de máquinas, traemos todas las máquinas sin filtrar por casino
    if (section === "Maquinas") {
      return maquinas.filter(
        (maquina) =>
          maquina.nroSerieMaquina
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          (selectedBrand === "" || maquina.marcaMaquina === selectedBrand)
      );
    }

    // Por defecto, si no hay sección o condiciones, devolvemos todas las máquinas
    return maquinas;
  }, [maquinas, selectedCasino, searchQuery, selectedBrand, section]);

  // Memoizamos los casinos filtrados basados en los filtros de búsqueda y ciudad
  const filteredCasinos = useMemo(() => {
    return casinos.filter(
      (casino) =>
        casino.nombreCasino.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (cityFilter === "" ||
          casino.ciudadCasino.toLowerCase().includes(cityFilter.toLowerCase()))
    );
  }, [casinos, searchQuery, cityFilter]);

  // Renderizado de las tarjetas de máquinas y casinos
  const renderMaquinas = useCallback(() => {
    return filteredMaquinas.map((maquina) => (
      <MaquinaCard key={maquina._id} maquina={maquina} />
    ));
  }, [filteredMaquinas]);

  const renderCasinos = useCallback(() => {
    return filteredCasinos.map((casino) => (
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
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          >
            <option value="">Todas las marcas</option>
            <option value="AINSWORTH">AINSWORTH</option>
            <option value="NOVOMATIC">NOVOMATIC</option>
            <option value="WILLIAMS">WILLIAMS</option>
            <option value="OPALSA">OTRO</option>
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
              currentPageCasinos * itemsPerPage >= filteredCasinos.length
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
