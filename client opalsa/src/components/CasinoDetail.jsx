import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { useElementos } from "../context/ElementosContext";
import { useMaquinas } from "../context/MaquinasContext";
import ElementsModal from "./ElementsModal";
import ConfirmModal from "./ConfirmModal";
import { deleteCasinoRequest } from "../api/casinos";

const CasinoDetail = ({
  selectedCasino,
  selectedBrand,
  handleFilterChange,
  abrirDocumento,
  setSelectedMaquina,
  setSelectedCasino,
}) => {
  const { getElementosByCasino } = useElementos();
  const { loadMaquinasByCasino, maquinas, noMaquinas } = useMaquinas();
  const [searchQueryMaquina, setSearchQueryMaquina] = useState(""); // Nuevo estado para la búsqueda de máquinas
  const [showModal, setShowModal] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar máquinas basadas en la búsqueda y el filtro de marca
  const filteredMaquinas = useMemo(() => {
    return maquinas.filter((maquina) => {
      const matchesSearch = searchQueryMaquina
        ? (maquina.nroSerieMaquina?.toLowerCase().includes(searchQueryMaquina.toLowerCase()) || 
           maquina.nombreMaquina?.toLowerCase().includes(searchQueryMaquina.toLowerCase()))
        : true;

      const matchesBrand = selectedBrand
        ? maquina.marcaMaquina === selectedBrand
        : true;

      return matchesSearch && matchesBrand;
    });
  }, [maquinas, searchQueryMaquina, selectedBrand]);

  // Cálculo de las máquinas a mostrar por página (después del filtrado)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaquinas = filteredMaquinas.slice(indexOfFirstItem, indexOfLastItem);

  // Estado de carga para las imágenes de las máquinas
  const [loadingImages, setLoadingImages] = useState(
    new Array(currentMaquinas.length).fill(true)
  );

  // Cargar máquinas filtradas por el casino cuando se seleccione un casino
  useEffect(() => {
    if (selectedCasino && selectedCasino.nombreCasino) {
      loadMaquinasByCasino(selectedCasino.nombreCasino);
    }
  }, [selectedCasino]);

  // Función para manejar la carga de las imágenes al cambiar de página
  useEffect(() => {
    const newLoadingImages = new Array(currentMaquinas.length).fill(true);
    setLoadingImages(newLoadingImages);

    const timers = currentMaquinas.map((_, index) => {
      return setTimeout(() => {
        setLoadingImages((prev) => {
          const newLoadingImages = [...prev];
          newLoadingImages[index] = false;
          return newLoadingImages;
        });
      }, 1000);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [currentPage, currentMaquinas.length]);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredMaquinas.length / itemsPerPage);

  // Función para abrir el modal de elementos del casino
  const handleOpenModal = async () => {
    await getElementosByCasino(selectedCasino._id);
    setShowModal(true);
  };

 // Función para eliminar el casino
const handleDeleteCasino = async () => {
  try {
    await deleteCasinoRequest(selectedCasino._id);
    setSelectedCasino(null);
    setIsConfirmModalOpen(false);
    window.location.reload(); // Recargar la página después de eliminar el casino
  } catch (error) {
    console.error("Error al eliminar el casino:", error);
  }
};


  return (
    <div className="mx-auto w-10/12 h-144 overflow-auto p-4 bg-casino-background bg-cover bg-center">
      <div className="relative flex flex-col items-center">
        <button
          onClick={() => setSelectedCasino(null)}
          className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Volver
        </button>
        <div className="flex items-start bg-black bg-opacity-25 py-16 rounded-lg px-4 justify-between w-4/5 mt-20">
          <div className="flex flex-col items-start w-1/3 ml-20">
            <h2 className="text-2xl font-bold text-white mt-20">
              {selectedCasino.nombreCasino}
            </h2>
            <p className="text-lg text-white flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              {selectedCasino.ciudadCasino}
            </p>
            <p className="text-lg text-white flex items-center">
              <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2" />
              {selectedCasino.direccionCasino}
            </p>
          </div>
          <div className="flex justify-center mt-4 w-1/3">
            <img
              src={selectedCasino.imgCasino.url}
              alt={selectedCasino.nombreCasino}
              className="w-48 h-48 object-cover rounded-full"
            />
          </div>
          <div className="text-center w-1/3 mr-20 mt-20">
            <p className="text-sky-200 font-bold text-4xl">
              {noMaquinas ? "0" : filteredMaquinas.length}
            </p>
            <h3 className="text-base font-bold text-white mt-2 inline-block py-1 px-2 rounded-md">
              MÁQUINAS EN EL CASINO
            </h3>
          </div>
        </div>

        <div className="flex mt-8 w-full justify-center items-center">
          <button
            onClick={handleOpenModal}
            className="bg-white text-blue-500 font-bold py-2 px-4 rounded-md 
                       transition duration-300 ease-in-out 
                       hover:bg-blue-500 hover:text-white 
                       hover:shadow-lg hover:scale-105"
          >
            Elementos en el casino
          </button>

          {/* Buscador de máquinas solo en esta sección */}
          <input
            type="text"
            value={searchQueryMaquina}
            onChange={(e) => setSearchQueryMaquina(e.target.value)} // Actualiza el estado de búsqueda
            placeholder="Buscar por nombre o número de serie"
            className="px-4 py-2 border rounded-md w-1/2 mx-2"
          />

          <select
            value={selectedBrand}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded-md md:w-auto"
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

        <div className="w-full mt-5">
          {noMaquinas ? (
            <div className="text-center text-white font-bold">
              No se encontraron máquinas para este casino
            </div>
          ) : (
            <table className="min-w-full bg-gray-50 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 uppercase tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                    Serial
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider"></th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentMaquinas.map((maquina, index) => (
                  <tr key={maquina._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-16 mr-2 relative">
                          {loadingImages[index] ? (
                            <div className="relative flex justify-center items-center w-16 h-16">
                              <div className="absolute animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                              <img
                                src="https://res.cloudinary.com/dtqiwgbbp/image/upload/v1727359701/vjg0klgqxuqfiesshgdb.jpg"
                                className="rounded-full h-12 w-12 object-cover"
                                alt="Loader"
                              />
                            </div>
                          ) : (
                            <img
                              src={maquina.imgMaquina.url}
                              alt="Logo Maquina"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-black font-medium text-left">
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
                          className="bg-blue-500 text-white font-bold py-1 px-2 rounded text-xs transition duration-200 ease-in-out transform hover:scale-110 hover:shadow-lg"
                          onClick={() => setSelectedMaquina(maquina)}
                        >
                          Ver más
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Paginación */}
          {!noMaquinas && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`mx-1 px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
              >
                Anterior
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 px-4 py-2 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`mx-1 px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Botón para eliminar el casino */}
        <button
          onClick={() => setIsConfirmModalOpen(true)}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-md mt-6 hover:bg-red-600 transition duration-300 ease-in-out hover:shadow-lg hover:scale-105"
        >
          Eliminar Casino
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDeleteCasino}
        message="¿Estás seguro de que deseas eliminar este casino? Esta acción no se puede deshacer."
      />

      <ElementsModal isOpen={showModal} onRequestClose={() => setShowModal(false)} casinoId={selectedCasino._id} />
    </div>
  );
};

export default CasinoDetail;
