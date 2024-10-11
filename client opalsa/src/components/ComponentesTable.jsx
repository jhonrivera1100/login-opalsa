import React, { useState, useEffect, useMemo } from "react";


// Helper para generar URL optimizada desde Cloudinary
const getOptimizedImageUrl = (
  url,
  width = 500,
  height = 500,
  quality = "auto"
) => {
  const transformation = `w_${width},h_${height},c_limit,q_${quality},f_auto`;
  return url.replace("/upload/", `/upload/${transformation}/`);
};

function ComponentesTable({
  sortedComponentes,
  editComponentId,
  editedComponent,
  handleEditClick,
  handleInputChange,
  handleSaveClick,
  handleCancelClick,
  handleDeleteComponente,
  abrirDocumento,
}) {
  const [tooltipSerial, setTooltipSerial] = useState(null); // Estado para manejar el tooltip del serial
  const [tooltipUser, setTooltipUser] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null); // Estado para manejar la vista previa de la imagen

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Memoizamos los componentes mostrados por página para evitar recalculaciones innecesarias
  const currentComponentes = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedComponentes.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedComponentes, currentPage]);

  // Calcular el número total de páginas
  const totalPages = useMemo(
    () => Math.ceil(sortedComponentes.length / itemsPerPage),
    [sortedComponentes.length]
  );

  // Estado de carga para las imágenes de los componentes
  const [loadingImages, setLoadingImages] = useState(
    new Array(currentComponentes.length).fill(true)
  );

  // Función para manejar la carga de las imágenes al cambiar de página
  useEffect(() => {
    const newLoadingImages = new Array(currentComponentes.length).fill(true);
    setLoadingImages(newLoadingImages);

    const timers = currentComponentes.map((_, index) => {
      return setTimeout(() => {
        setLoadingImages((prev) => {
          const newLoadingImages = [...prev];
          newLoadingImages[index] = false;
          return newLoadingImages;
        });
      }, 1000); // Simula un retraso de 1 segundo
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [currentComponentes]);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMouseEnter = (imgUrl) => {
    setZoomedImage(imgUrl); // Establece la imagen ampliada al pasar el mouse
  };

  const handleMouseLeave = () => {
    setZoomedImage(null); // Quita la imagen ampliada cuando se quita el mouse
  };

  const handleSerialMouseEnter = (serial) => {
    setTooltipSerial(serial); // Muestra el tooltip con el serial completo
  };

  const handleSerialMouseLeave = () => {
    setTooltipSerial(null); // Oculta el tooltip del serial
  };

  return (
    <div className="w-full flex flex-col min-h-[600px] max-h-[90vh] overflow-y-auto relative">
      {sortedComponentes.length === 0 ? (
        <div className="flex flex-col items-center mt-4 space-y-4">
          <span className="text-gray-500 text-lg text-center">
            Esta máquina aún no tiene componentes.
          </span>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 text-white px-2 py-2 rounded">
              Agregar Componente
            </button>
          </div>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/6">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4">
                  Serial
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4">
                  Marca
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4">
                  Documento
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentComponentes.map((componente, index) => {
                const isAssigned = componente.usuarioEncargado !== null;
                const serialComponente = componente.serialComponente || "";

                const optimizedImageUrl = componente.imagenComponente?.url
                  ? getOptimizedImageUrl(componente.imagenComponente.url)
                  : null;

                return (
                  <tr
                    key={componente._id}
                    className={`group ${
                      isAssigned ? "bg-yellow-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loadingImages[index] ? (
                        <div className="relative flex justify-center items-center w-12 h-12">
                          <div className="absolute animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
                          <img
                            src="https://res.cloudinary.com/dtqiwgbbp/image/upload/v1727359701/vjg0klgqxuqfiesshgdb.jpg"
                            className="rounded-full h-10 w-10 object-cover"
                            alt="Loader"
                          />
                        </div>
                      ) : optimizedImageUrl ? (
                        <img
                          src={optimizedImageUrl}
                          alt={componente.nombreComponente}
                          className="w-12 h-12 object-cover rounded cursor-pointer transform transition duration-200 hover:scale-125"
                          onMouseEnter={() =>
                            handleMouseEnter(optimizedImageUrl)
                          }
                          onMouseLeave={handleMouseLeave}
                          loading="lazy" // Lazy loading
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          No Disponible
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {editComponentId === componente._id ? (
                        <input
                          type="text"
                          name="nombreComponente"
                          value={editedComponent.nombreComponente}
                          onChange={handleInputChange}
                          className="text-sm font-medium text-gray-900"
                          disabled={isAssigned}
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {componente.nombreComponente}
                        </div>
                      )}
                    </td>

                    <td
                      className="px-6 py-4 whitespace-nowrap relative"
                      onMouseEnter={() =>
                        handleSerialMouseEnter(serialComponente)
                      }
                      onMouseLeave={handleSerialMouseLeave}
                    >
                      {editComponentId === componente._id ? (
                        <input
                          type="text"
                          name="serialComponente"
                          value={editedComponent.serialComponente}
                          onChange={handleInputChange}
                          className="text-sm text-gray-500"
                          disabled={isAssigned}
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {serialComponente.length > 20
                            ? `${serialComponente.slice(0, 16)}...`
                            : serialComponente}
                        </div>
                      )}

                      {/* Tooltip para mostrar el serial completo */}
                      {tooltipSerial === serialComponente && (
                        <div className="absolute bg-white border border-gray-300 p-2 rounded shadow-lg z-10">
                          {serialComponente}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {editComponentId === componente._id ? (
                        <input
                          type="text"
                          name="marcaComponente"
                          value={editedComponent.marcaComponente}
                          onChange={handleInputChange}
                          className="text-sm text-gray-500"
                          disabled={isAssigned}
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {componente.marcaComponente}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-gray-500 ml-8 flex items-center cursor-pointer"
                        onClick={() =>
                          abrirDocumento(componente.documentoComponente.url)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editComponentId === componente._id ? (
                        <div className="flex gap-4">
                          <button
                            onClick={handleSaveClick}
                            className={`text-green-600 hover:text-green-900 ${
                              isAssigned ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isAssigned}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className={`text-gray-600 hover:text-gray-900 ${
                              isAssigned ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isAssigned}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end items-center gap-4">
                          {isAssigned ? (
                            <span
                              className="text-gray-500 cursor-pointer"
                              onMouseEnter={() => {
                                setTooltipUser(componente.usuarioEncargado);
                                setTooltipVisible(true);
                              }}
                              onMouseLeave={() => {
                                setTooltipVisible(false);
                              }}
                            >
                              🛈 Componente en uso
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(componente)}
                                className="text-gray-600 hover:text-gray-900"
                                disabled={isAssigned}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteComponente(componente._id)
                                }
                                className="text-red-600 hover:text-red-900"
                                disabled={isAssigned}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 6h18m-1 0v12.75a1.125 1.125 0 01-1.125 1.125H4.125A1.125 1.125 0 013 18.75V6zm4.875-3a.375.375 0 01.375.375V6h6V3.375a.375.375 0 01.375-.375h3.375a.375.375 0 01.375.375V6h2.25a.375.375 0 01.375.375V6H20.25a.375.375 0 01.375.375V18.75a.375.375 0 01-.375.375H4.125a.375.375 0 01-.375-.375V6a.375.375 0 01.375-.375h2.25v2.25a.375.375 0 01.375.375v-2.25h.375z"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Paginación */}


          {tooltipVisible && tooltipUser && (
            <div
              className="absolute bg-white border border-gray-300 p-4 rounded shadow-lg"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <h3 className="text-lg text-center font-semibold">
                Usuario a cargo
              </h3>
              <p className="text-sm text-gray-600">
                Nombre: {tooltipUser.username}
              </p>
              <p className="text-sm text-gray-600">
                Email: {tooltipUser.email}
              </p>
              <p className="text-sm text-gray-600">
                Cédula: {tooltipUser.cedula}
              </p>
              <p className="text-sm text-gray-600">
                Cargo: {tooltipUser.cargo}
              </p>
              <p className="text-sm text-gray-600">
                Ciudad: {tooltipUser.ciudad}
              </p>
            </div>
          )}

          {/* Mostrar la vista previa de la imagen */}
          {zoomedImage && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50   rounded-lg w-96 h-96 flex items-center justify-center">
              <img
                src={zoomedImage}
                alt="Vista Previa"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ComponentesTable;
