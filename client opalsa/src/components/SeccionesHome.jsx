import React, { useState, useEffect } from "react";
import { getMaquinasRequest } from "../api/maquinas";
import { getCasinosRequest } from "../api/casinos";
import CasinoCard from "./CasinoCard";
import BotonAgregar from "../components/BotonAgregar";
import MaquinaCard from "../components/MaquinaCard";
import ModalMaquina from "../components/ModalMaquina";
import CasinoDetail from "../components/CasinoDetail";
import ModalDocumentos from "../components/ModalDocumentos";
import SectionContent from "./SectionContent";

function SeccionesHome() {
  const [section, setSection] = useState("Casinos");
  const [maquinas, setMaquinas] = useState([]);
  const [casinos, setCasinos] = useState([]);
  const [selectedCasino, setSelectedCasino] = useState(null);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [isDocumentosModalOpen, setIsDocumentosModalOpen] = useState(false);
  const [currentPageMaquinas, setCurrentPageMaquinas] = useState(1);
  const [totalPagesMaquinas, setTotalPagesMaquinas] = useState(1); // Para manejar el total de páginas de máquinas
  const [currentPageCasinos, setCurrentPageCasinos] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const itemsPerPage = 8;

  // Fetch de casinos solo una vez al montar el componente
  useEffect(() => {
    const fetchCasinos = async () => {
      try {
        const casinosResponse = await getCasinosRequest();
        setCasinos(casinosResponse.data);
      } catch (error) {
        console.error("Error al cargar los casinos:", error);
      }
    };
    fetchCasinos();
  }, []); // El efecto depende solo del montaje del componente, no de otras variables.

  // Fetch de máquinas dependiendo de la sección y la paginación
  // Fetch de máquinas dependiendo de la sección, página y marca seleccionada
  useEffect(() => {
    if (section === "Maquinas") {
      const fetchMaquinas = async () => {
        try {
          const maquinasResponse = await getMaquinasRequest(
            currentPageMaquinas,
            itemsPerPage,
            selectedBrand
          ); // Ahora se incluye la marca en la petición
          setMaquinas(maquinasResponse.data.maquinas);
          setTotalPagesMaquinas(maquinasResponse.data.totalPages); // Ajustamos el total de páginas
        } catch (error) {
          console.error("Error al cargar las máquinas:", error);
        }
      };
      fetchMaquinas();
    }
  }, [section, currentPageMaquinas, itemsPerPage, selectedBrand]); // Se agrega selectedBrand como dependencia
  // Solo recargar máquinas cuando se cambia a la sección "Maquinas" o la página

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPageMaquinas(1); // Reiniciar la página cuando se realice una nueva búsqueda
    setCurrentPageCasinos(1); // Reiniciar la página de casinos también
  };

  const handleFilterChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPageMaquinas(1); // Reiniciar la página de máquinas
  };

  const handleCityFilterChange = (e) => {
    setCityFilter(e.target.value);
    setCurrentPageCasinos(1); // Reiniciar la página de casinos
  };

  const changeSection = (newSection) => {
    setSection(newSection);
    setSelectedCasino(null); // Limpiar la selección de casino al cambiar de sección
    if (newSection === "Casinos") {
      setSelectedBrand("");
      setSearchQuery("");
      setCurrentPageMaquinas(1); // Reiniciar la página de máquinas
    }
  };

  // Funciones para paginación de máquinas
  const handlePreviousPageMaquinas = () => {
    setCurrentPageMaquinas((prevPage) => Math.max(prevPage - 1, 1)); // Evitar ir a una página menor a 1
  };

  const handleNextPageMaquinas = () => {
    setCurrentPageMaquinas((prevPage) =>
      Math.min(prevPage + 1, totalPagesMaquinas)
    ); // Incrementar la página de máquinas
  };

  // Funciones para paginación de casinos
  const handlePreviousPageCasinos = () => {
    setCurrentPageCasinos((prevPage) => Math.max(prevPage - 1, 1)); // Evitar ir a una página menor a 1
  };

  const handleNextPageCasinos = () => {
    setCurrentPageCasinos((prevPage) => prevPage + 1); // Incrementar la página de casinos
  };

  const abrirDocumento = (url) => {
    window.open(url, "_blank");
  };

  const handleVerDocumentos = (casino) => {
    if (casino) {
      const documentos = {
        documentacionLegal: casino.documentacionLegal || [],
        usoDeSuelos: casino.usoDeSuelos || [],
        colJuegos: casino.colJuegos || [],
        otrosDocumentos: casino.otrosDocumentos || [],
      };

      setDocumentos(documentos);
      setSelectedCasino(casino); // Guardamos el casino seleccionado
      setIsDocumentosModalOpen(true);
    } else {
      console.error("El casino no está definido o no contiene datos.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDocumentosModal = () => {
    setIsDocumentosModalOpen(false);
  };

  return (
    <div className="flex flex-col font-poppins">
      <div className="flex items-center justify-center py-3 bg-gray-100 mt-4">
        <div className="flex flex-wrap justify-center w-full">
          <div className="flex space-x-4 ml-4 md:ml-20">
            <button
              onClick={() => changeSection("Casinos")}
              className={`w-24 md:w-32 py-2 px-4 rounded-md font-semibold focus:outline-none ${
                section === "Casinos"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-300"
              }`}
            >
              Casinos
            </button>
            <button
              onClick={() => changeSection("Maquinas")}
              className={`w-24 md:w-32 py-2 px-4 rounded-md font-semibold focus:outline-none ${
                section === "Maquinas"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-300"
              }`}
            >
              Maquinas
            </button>
          </div>

          <div className="ml-4 md:ml-12 mt-2 md:mt-0 flex ">
            <BotonAgregar />
            <h3 className="flex mt-1 ml-3  font-semibold text-green-600">Agregar</h3>
          </div>
        </div>
      </div>
      <div className="bg-gray-100">
        <SectionContent
          section={section}
          selectedCasino={selectedCasino}
          maquinas={maquinas}
          casinos={casinos}
          searchQuery={searchQuery}
          selectedBrand={selectedBrand}
          cityFilter={cityFilter}
          currentPageMaquinas={currentPageMaquinas}
          currentPageCasinos={currentPageCasinos}
          itemsPerPage={itemsPerPage}
          totalPagesMaquinas={totalPagesMaquinas} // Total de páginas de máquinas
          handleSearch={handleSearch}
          handleFilterChange={handleFilterChange}
          handleCityFilterChange={handleCityFilterChange}
          setSelectedCasino={setSelectedCasino}
          setSelectedMaquina={setSelectedMaquina}
          handleVerDocumentos={handleVerDocumentos}
          abrirDocumento={abrirDocumento}
          handlePreviousPageMaquinas={handlePreviousPageMaquinas}
          handleNextPageMaquinas={handleNextPageMaquinas}
          handlePreviousPageCasinos={handlePreviousPageCasinos}
          handleNextPageCasinos={handleNextPageCasinos}
        />
      </div>

      {/* Modal para mostrar detalles de la máquina */}
      {selectedMaquina && (
        <ModalMaquina
          maquina={selectedMaquina}
          onClose={() => setSelectedMaquina(null)}
        />
      )}
      <ModalDocumentos
        isOpen={isDocumentosModalOpen}
        onClose={closeDocumentosModal}
        documentos={documentos}
        casinoId={selectedCasino ? selectedCasino._id : null}
      />
    </div>
  );
}

export default SeccionesHome;
