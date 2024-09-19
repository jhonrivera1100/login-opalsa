import React, { useState, useEffect } from "react";
import { getMaquinasRequest } from "../api/maquinas";
import { getCasinosRequest } from "../api/casinos";
import CasinoCard from "../components/casinoCard";
import BotonAgregar from "../components/BotonAgregar";
import MaquinaCard from "../components/MaquinaCard";
import ModalMaquina from "../components/ModalMaquina";
import CasinoDetail from "../components/CasinoDetail";
import ModalDocumentos from "../components/ModalDocumentos";
import SectionContent from "./SectionContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";

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
  const [currentPageCasinos, setCurrentPageCasinos] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const itemsPerPage = 8;

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
    setCurrentPageMaquinas(1);
    setCurrentPageCasinos(1);
  };
  

  const handleFilterChange = (e) => {
    setSelectedBrand(e.target.value);
    setCurrentPageMaquinas(1);
  };

  const handleCityFilterChange = (e) => {
    setCityFilter(e.target.value);
    setCurrentPageCasinos(1);
  };

  const changeSection = (newSection) => {
    setSection(newSection);
    setSelectedCasino(null);
    if (newSection === "Casinos") {
      setSelectedBrand("");
      setSearchQuery("");
      setCurrentPageMaquinas(1);
    }
  };

  const handlePreviousPageMaquinas = () => {
    setCurrentPageMaquinas((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageMaquinas = () => {
    setCurrentPageMaquinas((prevPage) => prevPage + 1);
  };

  const handlePreviousPageCasinos = () => {
    setCurrentPageCasinos((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPageCasinos = () => {
    setCurrentPageCasinos((prevPage) => prevPage + 1);
  };

  const abrirDocumento = (url) => {
    window.open(url, "_blank");
  };

  const handleVerDocumentos = (casino) => {
    console.log(casino); // Asegúrate de que el objeto tenga la estructura correcta
    if (casino) {
      const documentos = {
        documentacionLegal: casino.documentacionLegal || [],
        usoDeSuelos: casino.usoDeSuelos || [],
        colJuegos: casino.colJuegos || [],
        otrosDocumentos: casino.otrosDocumentos || []
      };
      
      // Mostrar un mensaje si todos los documentos están vacíos
      if (
        documentos.documentacionLegal.length === 0 &&
        documentos.usoDeSuelos.length === 0 &&
        documentos.colJuegos.length === 0 &&
        documentos.otrosDocumentos.length === 0
      ) {
        console.log("No hay documentos disponibles para este casino.");
      } else {
        setDocumentos(documentos);
        setIsDocumentosModalOpen(true);
      }
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
    <div className="flex flex-col">
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

          <div className="ml-4 md:ml-12 mt-2 md:mt-0">
            <BotonAgregar />
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
      />
    </div>
  );
}

export default SeccionesHome;
