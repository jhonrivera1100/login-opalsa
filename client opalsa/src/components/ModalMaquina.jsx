import React, { useState, useEffect } from "react";
import { useComponentes } from "../context/ComponentesContext";
import AgregarComponenteModal from "./AgregarComponenteModal";
import TransferirComponenteModal from "./TransferirComponenteModal";
import { deleteComponentesRequest } from "../api/componentes";
import { deleteMaquinasRequest, updateMaquinasRequest } from "../api/maquinas"; // Importar la función de eliminación desde tu archivo de peticiones

function ModalMaquina({ maquina, onClose }) {
  const { componentes, getComponentes } = useComponentes();

  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [showTransferirModal, setShowTransferirModal] = useState(false);
  const [showComponentes, setShowComponentes] = useState(false);

  useEffect(() => {
    getComponentes();
  }, []);

  const sortedComponentes = componentes
    .filter((componente) => componente.maquina === maquina._id)
    .sort((a, b) => a.nombreComponente.localeCompare(b.nombreComponente));

  const toggleComponentes = () => {
    setShowComponentes(!showComponentes);
  };

  const handleTransferComplete = () => {
    getComponentes();
    setShowTransferirModal(false);
  };

  const handleDeleteComponente = async (componenteId) => {
    try {
      await deleteComponentesRequest(componenteId);
      getComponentes(); // Actualizar la lista de componentes después de eliminar
    } catch (error) {
      console.error("Error al eliminar el componente:", error);
      // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  const toggleEstadoMaquina = async () => {
    const nuevoEstado =
      maquina.estadoMaquina === "activo" ? "inactivo" : "activo";

    try {
      // Actualiza el estado en el backend
      await updateMaquinasRequest({ ...maquina, estadoMaquina: nuevoEstado });

      // Actualiza el estado localmente
      maquina.estadoMaquina = nuevoEstado;
      // Puedes actualizar otros componentes relacionados si es necesario
    } catch (error) {
      console.error("Error al cambiar el estado de la máquina:", error);
      // Manejo de errores, como mostrar un mensaje al usuario
    }
  };

  const handleEliminarMaquina = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta máquina?"
    );
    if (confirmDelete) {
      try {
        // Lógica para eliminar la máquina
        await deleteMaquinasRequest(maquina._id); // Debes implementar esta función
        onClose(); // Cerrar el modal después de eliminar
      } catch (error) {
        console.error("Error al eliminar la máquina:", error);
        // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="bg-gray-100 shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto p-6 relative text-sm flex">
        <button
          className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="w-4/12 max-h-[90vh] pr-4">
          <div className="max-w-sm rounded-lg py-2 overflow-hidden transition-transform duration-300 cursor-pointer mx-2 transform hover:-translate-y-1">
            <img
              src={maquina.imgMaquina.url}
              alt={maquina.nombreMaquina}
              className="w-full h-[400px] object-cover object-center rounded-lg shadow-lg hover:shadow-xl"
            />
            <div className="relative px-4 -mt-16">
              <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-xl">
                <div className="flex items-baseline">
                  <button
                    onClick={toggleEstadoMaquina}
                    className={`text-xs px-2 inline-block rounded-full uppercase hover:scale-105 font-semibold tracking-wide ${
                      maquina.estadoMaquina === "inactivo"
                        ? "bg-red-200 text-red-800"
                        : "bg-teal-200 text-teal-800"
                    }`}
                  >
                    {maquina.estadoMaquina === "inactivo"
                      ? "Inactivo"
                      : "Activo"}
                  </button>
                  <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                    Serial: {maquina.nroSerieMaquina}
                  </div>
                </div>

                <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">
                  {maquina.marcaMaquina}
                </h4>
                <div className="mt-1">
                  <span className="text-gray-600 text-sm">
                    {maquina.ubicacionMaquina}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-teal-600 text-md font-semibold">
                    Instalación:
                  </span>{" "}
                  <span className="text-sm text-gray-600">
                    {maquina.fechaInstalacionMaquina}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-teal-600 text-md font-semibold">
                    Nombre:
                  </span>{" "}
                  <span className="text-sm text-gray-600">
                    {maquina.nombreMaquina}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-teal-600 text-md font-semibold">
                    Modelo:
                  </span>{" "}
                  <span className="text-sm text-gray-600">
                    {maquina.modeloMaquina}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-teal-600 text-md font-semibold">
                    Software:
                  </span>{" "}
                  <span className="text-sm text-gray-600">
                    {maquina.softwareMaquina}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-teal-600 text-md font-semibold">
                    Juego:
                  </span>{" "}
                  <span className="text-sm text-gray-600">
                    {maquina.juegoMaquina}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-teal-600 text-md font-semibold">
                    Proveedor:
                  </span>{" "}
                  <span className="text-sm text-gray-600">
                    {maquina.proveedorMaquina}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-teal-600 text-md font-semibold">
                    Descripción:
                  </span>{" "}
                  <span className="text-sm text-gray-600">
                    {maquina.descripcionMaquina}
                  </span>
                </div>

                {/* Botón para eliminar la máquina */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleEliminarMaquina}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar Máquina
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col pl-4 max-h-[90vh] overflow-y-auto">
          <h1 className="text-xl text-black text-center py-3 font-bold mb-4">
            Componentes de la máquina
          </h1>
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4"
                    >
                      Serial
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4"
                    >
                      Marca
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-medium text-teal-600 uppercase tracking-wider w-1/4"
                    >
                      Documento
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedComponentes.map((componente) => (
                    <tr key={componente._id} className="group hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {componente.nombreComponente}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {componente.serialComponente}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {componente.marcaComponente}
                        </div>
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap">
                        <div className="text-gray-500 hover:text-gray-900 flex items-center">
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
                        <div className="flex justify-end gap-4">
                          <a
                            href="#"
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
                          </a>
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
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowAgregarModal(true)}
                  className="bg-blue-500 text-white px-2 py-2 rounded"
                >
                  Agregar Componente
                </button>
                <button
                  onClick={() => setShowTransferirModal(true)}
                  className="bg-green-500 text-white px-2 py-2 rounded"
                >
                  Transferir Componente
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showAgregarModal && (
        <AgregarComponenteModal
          maquinaId={maquina._id}
          onClose={() => setShowAgregarModal(false)}
        />
      )}

      {showTransferirModal && (
        <TransferirComponenteModal
          maquina={maquina}
          componentes={componentes}
          onClose={handleTransferComplete}
        />
      )}
    </div>
  );
}

export default ModalMaquina;
