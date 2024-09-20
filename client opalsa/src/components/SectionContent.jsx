import React from "react";
import MaquinaCard from "../components/MaquinaCard";
import CasinoCard from "../components/casinoCard";
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
  if (selectedCasino) {
    const filteredMaquinas = maquinas.filter((maquina) => {
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
          setSelectedCasino={setSelectedCasino} // Pasar la función para cerrar el detalle del casino
        />
      </div>
    );
  }

  const startIndexMaquinas = (currentPageMaquinas - 1) * itemsPerPage;
  const endIndexMaquinas = startIndexMaquinas + itemsPerPage;
  const paginatedMaquinas = maquinas
    .filter(
      (maquina) =>
        (maquina.nroSerieMaquina
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          maquina.nroSerieMaquina
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        (selectedBrand === "" || maquina.marcaMaquina === selectedBrand)
    )
    .slice(startIndexMaquinas, endIndexMaquinas);

  const startIndexCasinos = (currentPageCasinos - 1) * itemsPerPage;
  const endIndexCasinos = startIndexCasinos + itemsPerPage;
  const paginatedCasinos = casinos
    .filter(
      (casino) =>
        casino.nombreCasino.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (cityFilter === "" ||
          casino.ciudadCasino.toLowerCase().includes(cityFilter.toLowerCase()))
    )
    .slice(startIndexCasinos, endIndexCasinos);

  return (
    <div className="font-poppins mx-auto bg-gray-100 w-11/12 md:w-10/12 h-144 overflow-auto p-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {section === "Maquinas" &&
          paginatedMaquinas.map((maquina) => (
            <MaquinaCard key={maquina._id} maquina={maquina} />
          ))}
        {section === "Casinos" &&
          paginatedCasinos.map((casino) => (
            <CasinoCard
              key={casino._id}
              casino={casino}
              onVerMas={() => setSelectedCasino(casino)}
              onVerDocumentos={() => handleVerDocumentos(casino)} // Pasa el objeto completo del casino
            />
          ))}
      </div>
      {section === "Maquinas" && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPageMaquinas}
            disabled={currentPageMaquinas === 1}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={handleNextPageMaquinas}
            disabled={currentPageMaquinas * itemsPerPage >= maquinas.length}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
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
            disabled={currentPageCasinos * itemsPerPage >= casinos.length}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionContent;
