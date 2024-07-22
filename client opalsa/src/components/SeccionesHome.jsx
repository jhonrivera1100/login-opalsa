import React, { useState, useEffect } from "react";
import { getMaquinasRequest } from "../api/maquinas";
import { getCasinosRequest } from "../api/casinos";
import CasinoCard from "../components/casinoCard";
import BotonAgregar from "../components/BotonAgregar";
import MaquinaCard from "../components/MaquinaCard";
import ModalMaquina from "../components/ModalMaquina";
import ModalDocumentos from "../components/ModalDocumentos";

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

  const handleVerDocumentos = (documentacion) => {
    setDocumentos(documentacion);
    setIsDocumentosModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDocumentosModal = () => {
    setIsDocumentosModalOpen(false);
  };


  const renderSectionContent = () => {
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
        <div className="mx-auto w-10/12 h-144 overflow-auto p-4">
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => setSelectedCasino(null)}
              className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Volver
            </button>
            <img
              src={selectedCasino.imgCasino.url}
              alt={selectedCasino.nombreCasino}
              className="w-48 h-48 object-cover rounded-lg mt-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              {selectedCasino.nombreCasino}
            </h2>
            <p className="text-lg text-gray-500">{selectedCasino.ciudadCasino}</p>
            <p className="text-lg text-gray-500">{selectedCasino.direccionCasino}</p>
            <div className="w-full text-center mt-8 mb-4">
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">
                MÁQUINAS EN EL CASINO
              </h3>
              <p className="text-lg text-gray-500">Total: {filteredMaquinas.length}</p>
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
            <div className="w-full mt-5">
              <table className="min-w-full bg-white divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider"
                    >
                      Serial
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider"
                    >
                      Marca
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider"
                    >
                      Documento
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider"
                    ></th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMaquinas.map((maquina) => (
                    <tr
                      key={maquina._id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <div className="w-16 h-16 mr-2">
                            <img
                              src={maquina.imgMaquina.url}
                              alt="Logo Maquina"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-500 font-normal text-left">
                        {maquina.nroSerieMaquina}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-500 font-normal text-left">
                        {maquina.marcaMaquina}
                      </td>
                      <td className="px-12 py-2 whitespace-nowrap text-gray-500 font-normal text-left">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6 hover:text-gray-900 cursor-pointer"
                            onClick={() => abrirDocumento(maquina.documentoMaquina.url)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-4">
                          <button
                            className="bg-blue-500 text-white font-bold py-1 px-2 rounded text-xs"
                            onClick={() => setSelectedMaquina(maquina)} // Aquí se establece la máquina seleccionada
                          >
                            Ver más
                          </button>
                          <button className="bg-blue-500 text-white font-bold py-1 px-2 rounded text-xs ml-2">
                            Registros
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap"></td>
                    </tr>
                  ))}
                  {filteredMaquinas.length === 0 && (
                    <tr>
                      <td className="px-4 py-2 text-center" colSpan="6">
                        No se encontraron máquinas para este casino.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
          casino.nombreCasino
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) &&
          (cityFilter === "" || casino.ciudadCasino === cityFilter)
      )
      .slice(startIndexCasinos, endIndexCasinos);

    return (
      <div className="mx-auto bg-gray-100 w-10/12 h-144 overflow-auto p-4">
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
        {section === "Casinos" && (
          <div className="flex mb-4 w-full justify-center items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar por nombre del casino"
              className="px-4 py-2 border rounded-md w-1/2 mx-2"
            />
            <select
              value={cityFilter}
              onChange={handleCityFilterChange}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Todas las ciudades</option>
              <option value="Cali">Cali</option>
              <option value="Popayan">Popayan</option>
              <option value="Pasto">Pasto</option>
              <option value="Tulua">Tulua</option>
            </select>
          </div>
        )}
        <div className="grid grid-cols-4 gap-1">
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
                onVerDocumentos={() => handleVerDocumentos(casino.documentacionCasino)}
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
              disabled={
                currentPageMaquinas * itemsPerPage >= maquinas.length
              }
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
              disabled={
                currentPageCasinos * itemsPerPage >= casinos.length
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

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center py-3 bg-gray-100 mt-4">
        <div className="flex justify-center w-full">
          <div className="flex space-x-4 ml-20">
            <button
              onClick={() => changeSection("Casinos")}
              className={`w-32 py-2 px-4 rounded-md font-semibold focus:outline-none ${
                section === "Casinos"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-300"
              }`}
            >
              Casinos
            </button>
            <button
              onClick={() => changeSection("Maquinas")}
              className={`w-32 py-2 px-4 rounded-md font-semibold focus:outline-none ${
                section === "Maquinas"
                  ? "bg-blue-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-300"
              }`}
            >
              Máquinas
            </button>
          </div>

          <div className="ml-12">
            <BotonAgregar />
          </div>
        </div>
      </div>
      <div className="bg-gray-100">{renderSectionContent()}</div>

      {/* Modal para mostrar detalles de la máquina */}
      {selectedMaquina && (
        <ModalMaquina
          maquina={selectedMaquina}
          onClose={() => setSelectedMaquina(null)}
        />
      )}
        <ModalDocumentos 
        isOpen={isDocumentosModalOpen} // Asegúrate de usar el estado correcto para este modal
        onClose={closeDocumentosModal} // Asegúrate de usar el método de cierre correcto
        documentos={documentos}
      />
    </div>
  );
}

export default SeccionesHome;
