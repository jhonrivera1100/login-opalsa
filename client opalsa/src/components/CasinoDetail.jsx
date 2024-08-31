// src/components/CasinoDetail.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons";
import { useElementos } from '../context/ElementosContext';
import ElementsModal from './ElementsModal';

const CasinoDetail = ({
  selectedCasino,
  filteredMaquinas,
  searchQuery,
  handleSearch,
  selectedBrand,
  handleFilterChange,
  abrirDocumento,
  setSelectedMaquina,
  setSelectedCasino
}) => {
  const { getElementosByCasino, elementos } = useElementos(); // Asegúrate de que `elementos` esté en el contexto
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = async () => {
    await getElementosByCasino(selectedCasino._id);
    setShowModal(true);
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
              {filteredMaquinas.length}
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
            <option value="AINSWORTH">AINSWORTH</option>
            <option value="NOVOMATIC">NOVOMATIC</option>
            <option value="OTRO">OTRO</option>
          </select>
        </div>
        <div className="w-full mt-5">
          <table className="min-w-full bg-gray-50 divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3 uppercase tracking-wider"></th>
                <th scope="col" className="px-6 py-3 text-left text-sm text-blue-600 uppercase tracking-wider">
                  Serial
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                  Marca
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-blue-600 uppercase tracking-wider">
                  Documento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider"></th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMaquinas.map((maquina) => (
                <tr key={maquina._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 mr-2">
                        {maquina.imgMaquina && maquina.imgMaquina.url ? (
                          <img
                            src={maquina.imgMaquina.url}
                            alt="Logo Maquina"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                            <span>No Imagen</span>
                          </div>
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
                        className="bg-blue-500 text-white font-bold py-1 px-2 rounded text-xs"
                        onClick={() => setSelectedMaquina(maquina)}
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
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay máquinas disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      <ElementsModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        casinoId={selectedCasino._id}
      />
    </div>
  );
};

export default CasinoDetail;
