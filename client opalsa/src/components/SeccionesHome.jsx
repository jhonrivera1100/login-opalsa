import React, { useState, useEffect } from "react";
import { getMaquinasRequest } from "../api/maquinas";
import { getCasinosRequest } from "../api/casinos";
import CasinoCard from "../components/casinoCard";
import MaquinaCard from "../components/MaquinaCard";
import maquinaLogo from '../assets/images/maquina.png'; // Importa la imagen correctamente

function SeccionesHome() {
  const [section, setSection] = useState("Empresas");
  const [maquinas, setMaquinas] = useState([]);
  const [casinos, setCasinos] = useState([]);
  const [selectedCasino, setSelectedCasino] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el valor de búsqueda
  const [selectedBrand, setSelectedBrand] = useState(""); // Estado para el filtro de marca
  const itemsPerPage = 8; // Número de elementos por página

  useEffect(() => {
    const fetchData = async () => {
      try {
        const maquinasResponse = await getMaquinasRequest();
        setMaquinas(maquinasResponse.data);
        const casinosResponse = await getCasinosRequest();
        setCasinos(casinosResponse.data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al realizar una búsqueda
  };

  const handleFilterChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al cambiar el filtro
  };

  const renderSectionContent = () => {
    if (selectedCasino) {
      const filteredMaquinas = maquinas.filter(
        (maquina) =>
          maquina.ubicacionMaquina === selectedCasino.nombreCasino &&
          (maquina.nombreMaquina.toLowerCase().includes(searchQuery.toLowerCase()) ||
            maquina.nroSerieMaquina.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (selectedBrand === "" || maquina.marcaMaquina === selectedBrand)
      );

      return (
        
        <div className="mx-auto border border-zinc-300 w-9/12 h-144 overflow-auto bg-stone-100 p-4">
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => setSelectedCasino(null)}
              className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Volver
            </button>
            <img src={selectedCasino.imgCasino.url} alt={selectedCasino.nombreCasino} className="w-48 h-48 object-cover rounded-lg mt-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{selectedCasino.nombreCasino}</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">{selectedCasino.ciudadCasino}</p>
            <p className="text-lg text-gray-500 dark:text-gray-400">{selectedCasino.direccionCasino}</p>
            <div className="w-full text-center mt-8 mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-2">MAQUINAS EN EL CASINO</h3>
              <p className="text-lg text-gray-500 dark:text-gray-400">Total: {filteredMaquinas.length}</p>
            </div>
            <div className="flex mb-4 w-full justify-center items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar por nombre o número de serie"
                className="px-4 py-2 border rounded-md w-1/2 mx-2"
              />
              <select
                value={selectedBrand}
                onChange={handleFilterChange}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">Todas las marcas</option>
                <option value="IGT">IGT</option>
                <option value="MAQ">MAQ</option>
                <option value="OTRO">OTRO</option>
              </select>
            </div>
            <div className="grid grid-cols-6 gap-4 mt-4">
              {filteredMaquinas.map(maquina => (
                <div key={maquina._id} className="flex flex-col text-black rounded-lg p-1 relative group hover:border-black border transition-all duration-300">
                  <p className="text-sm font-bold text-center text-gray-800 mb-2">{maquina.nroSerieMaquina}</p>
                  <img src={maquinaLogo} alt="Logo Maquina" className="w-1/2 self-center mb-2" /> {/* Usa la imagen importada */}
                  <p className="text-sm text-center font-semibold">{maquina.marcaMaquina}</p>
                  <p className="text-sm text-center text-blue-900 font-semibold">{maquina.nombreMaquina}</p>
                  <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-blue-500 text-white font-bold py-1 px-2 rounded text-xs">
                      Ver más
                    </button>
                    <button className="bg-blue-500 text-white font-bold py-1 px-2 rounded text-xs ml-2">
                      Registros
                    </button>
                  </div>
                </div>
              ))}
              {filteredMaquinas.length === 0 && (
                <p className="text-gray-800 col-span-5">No se encontraron máquinas para este casino.</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    let sectionData = [];
    if (section === "Maquinas") {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      sectionData = maquinas
        .filter(
          (maquina) =>
            (maquina.nombreMaquina.toLowerCase().includes(searchQuery.toLowerCase()) ||
              maquina.nroSerieMaquina.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedBrand === "" || maquina.marcaMaquina === selectedBrand)
        )
        .slice(startIndex, endIndex);
    } else if (section === "Casinos") {
      sectionData = casinos;
    } else {
      return <p>Empresas placeholder content</p>;
    }

    const handlePreviousPage = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
      setCurrentPage((prevPage) => (prevPage * itemsPerPage < maquinas.length ? prevPage + 1 : prevPage));
    };

    return (
      <div className="mx-auto border border-zinc-300 w-9/12 h-144 overflow-auto bg-stone-100 p-4">
        {section === "Maquinas" && (
          <div className="flex mb-4 w-full justify-center items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar por nombre o número de serie"
              className="px-4 py-2 border rounded-md w-1/2 mx-2"
            />
            <select
              value={selectedBrand}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Todas las marcas</option>
              <option value="IGT">IGT</option>
              <option value="MAQ">MAQ</option>
              <option value="OTRO">OTRO</option>
            </select>
          </div>
        )}
        <div className="grid grid-cols-4 gap-1">
          {section === "Maquinas" &&
            sectionData.map((maquina) => (
              <MaquinaCard key={maquina._id} maquina={maquina} />
            ))}
          {section === "Casinos" &&
            sectionData.map((casino) => (
              <CasinoCard key={casino._id} casino={casino} onVerMas={() => setSelectedCasino(casino)} />
            ))}
        </div>
        {section === "Maquinas" && (
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage * itemsPerPage >= maquinas.length}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="flex justify-center mt-4">
        <button
          className={section === "Empresas" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"}
          onClick={() => setSection("Empresas")}
        >
          Empresas
        </button>
        <button
          className={section === "Casinos" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"}
          onClick={() => setSection("Casinos")}
        >
          Casinos
        </button>
        <button
          className={section === "Maquinas" ? "bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded" : "text-blue-500 font-bold py-2 px-4 mx-2"}
          onClick={() => setSection("Maquinas")}
        >
          Máquinas
        </button>
      </div>

      <div className="mt-4">
        {renderSectionContent()}
      </div>
    </div>
  );
}

export default SeccionesHome;
