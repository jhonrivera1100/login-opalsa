import React from "react";

function CardMaquinaModal({
  maquina,
  estadoMaquina,
  toggleEstadoMaquina,
  handleEliminarMaquina,
  setShowTransferirMaquinaModal
}) {
  return (
    <div className="w-4/12 max-h-[90vh] pr-4">
      <div className="max-w-sm rounded-lg py-2 overflow-hidden transition-transform duration-300 cursor-pointer mx-2 transform hover:-translate-y-1">
        <img
          src={maquina.imgMaquina.url}
          className="w-full h-[400px] object-cover object-center rounded-lg shadow-lg hover:shadow-xl"
        />
        <div className="relative px-4 -mt-16">
          <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-xl">
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

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowTransferirMaquinaModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Transferir Máquina
              </button>
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
  );
}

export default CardMaquinaModal;
