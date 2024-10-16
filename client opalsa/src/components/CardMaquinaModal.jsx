import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

function CardMaquinaModal({
  maquina,
  estadoMaquina,
  toggleEstadoMaquina,
  handleEliminarMaquina,
  setShowTransferirMaquinaModal,
  updateMaquina,
}) {
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editedMaquina, setEditedMaquina] = useState({
    nroSerieMaquina: maquina.nroSerieMaquina,
    modeloMaquina: maquina.modeloMaquina,
    marcaMaquina: maquina.marcaMaquina,
    precioMaquina: maquina.precioMaquina,
    juegoMaquina: maquina.juegoMaquina,
    estadoMaquina: maquina.estadoMaquina,
    ubicacionMaquina: maquina.ubicacionMaquina,
    fechaInstalacionMaquina: maquina.fechaInstalacionMaquina,
    proveedorMaquina: maquina.proveedorMaquina,
  });
  const [documentoMaquina, setDocumentoMaquina] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMaquina((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDocumentoMaquina(e.target.files[0]);
  };

  const handleSaveEdits = () => {
    const formData = new FormData();
    Object.keys(editedMaquina).forEach((key) => {
      formData.append(key, editedMaquina[key]);
    });

    if (documentoMaquina) {
      formData.append("documentoMaquina", documentoMaquina);
    }

    updateMaquina(formData);
    setEditMode(false);
  };

  const handleConfirmDelete = () => {
    handleEliminarMaquina(); // Llama directamente a la función de eliminar sin alert o confirmación
    setConfirmDelete(false);
  };

  return (
    <div className="w-4/12 max-h-[90vh] pr-4">
      <div className="max-w-sm rounded-lg py-2 overflow-hidden transition-transform duration-300 cursor-pointer mx-2 transform hover:-translate-y-1">
        <img
          src={maquina.imgMaquina?.url || "/placeholder.png"}
          alt="Imagen de la máquina"
          className="w-full h-[400px] object-cover object-center rounded-lg shadow-lg hover:shadow-xl"
        />
        <div className="relative px-4 -mt-16">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-baseline">
              <button
                onClick={toggleEstadoMaquina}
                className={`text-xs px-2 inline-block rounded-full uppercase hover:scale-105 font-semibold tracking-wide ${
                  estadoMaquina === "inactivo"
                    ? "bg-red-200 text-red-800"
                    : "bg-teal-200 text-teal-800"
                }`}
              >
                {estadoMaquina === "inactivo" ? "Inactivo" : "Activo"}
              </button>
              <div className="ml-2 text-gray-600 uppercase text-xs font-semibold tracking-wider">
                Serial:{" "}
                {editMode ? (
                  <input
                    type="text"
                    value={editedMaquina.nroSerieMaquina}
                    name="nroSerieMaquina"
                    onChange={handleInputChange}
                    className="text-black"
                  />
                ) : (
                  maquina.nroSerieMaquina
                )}
              </div>
            </div>

            <h4 className="mt-1 text-xl font-semibold uppercase leading-tight truncate">
              {editMode ? (
                <input
                  type="text"
                  value={editedMaquina.marcaMaquina}
                  name="marcaMaquina"
                  onChange={handleInputChange}
                  className="text-black"
                />
              ) : (
                maquina.marcaMaquina
              )}
            </h4>
            <div className="mt-1 flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-600" />
              <span className="text-gray-600 text-sm">
                {maquina.ubicacionMaquina}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-teal-600 text-md font-semibold">
                Instalación:
              </span>{" "}
              <span className="text-sm text-gray-600">
                {editMode ? (
                  <input
                    type="date"
                    value={editedMaquina.fechaInstalacionMaquina}
                    name="fechaInstalacionMaquina"
                    onChange={handleInputChange}
                    className="text-black"
                  />
                ) : (
                  maquina.fechaInstalacionMaquina
                )}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-teal-600 text-md font-semibold">
                Modelo:
              </span>{" "}
              <span className="text-sm text-gray-600">
                {editMode ? (
                  <input
                    type="text"
                    value={editedMaquina.modeloMaquina}
                    name="modeloMaquina"
                    onChange={handleInputChange}
                    className="text-black"
                  />
                ) : (
                  maquina.modeloMaquina
                )}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-teal-600 text-md font-semibold">
                Precio:
              </span>{" "}
              <span className="text-sm text-gray-600">
                {editMode ? (
                  <input
                    type="text"
                    value={editedMaquina.precioMaquina}
                    name="precioMaquina"
                    onChange={handleInputChange}
                    className="text-black"
                  />
                ) : (
                  maquina.precioMaquina
                )}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-teal-600 text-md font-semibold">
                Juego:
              </span>{" "}
              <span className="text-sm text-gray-600">
                {editMode ? (
                  <input
                    type="text"
                    value={editedMaquina.juegoMaquina}
                    name="juegoMaquina"
                    onChange={handleInputChange}
                    className="text-black"
                  />
                ) : (
                  maquina.juegoMaquina
                )}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-teal-600 text-md font-semibold">
                Proveedor:
              </span>{" "}
              <span className="text-sm text-gray-600">
                {editMode ? (
                  <input
                    type="text"
                    value={editedMaquina.proveedorMaquina}
                    name="proveedorMaquina"
                    onChange={handleInputChange}
                    className="text-black"
                  />
                ) : (
                  maquina.proveedorMaquina
                )}
              </span>
            </div>

            {editMode && !maquina.documentoMaquina?.url && (
              <div className="mt-4">
                <label
                  htmlFor="documentoMaquina"
                  className="text-teal-600 text-md font-semibold"
                >
                  Agrega un documento a la máquina:
                </label>
                <input
                  type="file"
                  name="documentoMaquina"
                  onChange={handleFileChange}
                  className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                />
              </div>
            )}

            <div className="mt-4 flex flex-col space-y-2">
              {editMode ? (
                <>
                  <button
                    onClick={handleSaveEdits}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowTransferirMaquinaModal(true)}
                    className="bg-green-500 text-white px-3 py-2 rounded"
                  >
                    Transferir Máquina
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 text-white px-3 py-2 rounded"
                  >
                    Editar Máquina
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:text-red-900"
                  >
                    Eliminar Máquina
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Modal de Confirmación de Eliminación */}
        {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Confirmar Eliminación</h3>
            <p className="mb-4">¿Estás seguro de que deseas eliminar esta máquina?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardMaquinaModal;
