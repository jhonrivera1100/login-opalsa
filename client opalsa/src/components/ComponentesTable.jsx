import React from 'react';

function ComponentesTable({
  sortedComponentes,
  editComponentId,
  editedComponent,
  handleEditClick,
  handleInputChange,
  handleSaveClick,
  handleCancelClick,
  handleDeleteComponente,
  abrirDocumento
}) {
  return (
    <div className="w-full flex flex-col max-h-[90vh] overflow-y-auto">
      {sortedComponentes.length === 0 ? (
        <div className="flex flex-col items-center mt-4 space-y-4">
          <span className="text-gray-500 text-lg text-center">
            Esta máquina aún no tiene componentes.
          </span>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowAgregarModal(true)}
              className="bg-blue-500 text-white px-2 py-2 rounded"
            >
              Agregar Componente
            </button>
          </div>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-white">
              <tr>
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
              {sortedComponentes.map((componente) => (
                <tr key={componente._id} className="group hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editComponentId === componente._id ? (
                      <input
                        type="text"
                        name="nombreComponente"
                        value={editedComponent.nombreComponente}
                        onChange={handleInputChange}
                        className="text-sm font-medium text-gray-900"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {componente.nombreComponente}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editComponentId === componente._id ? (
                      <input
                        type="text"
                        name="serialComponente"
                        value={editedComponent.serialComponente}
                        onChange={handleInputChange}
                        className="text-sm text-gray-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">
                        {componente.serialComponente}
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
                          className="text-green-600 hover:text-green-900"
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
                          className="text-gray-600 hover:text-gray-900"
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
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleEditClick(componente)}
                          className="text-gray-600 hover:text-gray-900"
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
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ComponentesTable;
