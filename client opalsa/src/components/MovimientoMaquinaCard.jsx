import React from "react";
import { FaTools } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { MdAutoAwesomeMotion, MdCasino } from "react-icons/md";

const MovimientoMaquinaCard = ({ item, handleDescriptionClick, deleteItem }) => {
  return (
    <div
      key={item._id}
      className="relative bg-white py-6 px-6 rounded-3xl w-[250px] shadow-xl m-4"
    >
      <div
        className={`text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl ${
          item.type === "mantenimiento"
            ? "bg-green-500"
            : item.type === "movimiento"
            ? "bg-blue-500"
            : "bg-yellow-500"
        } left-4 -top-6`}
      >
        {item.type === "mantenimiento" ? (
          <FaTools className="h-8 w-8" />
        ) : item.type === "movimiento" ? (
          <MdAutoAwesomeMotion className="h-8 w-8" />
        ) : (
          <div className="h-8 w-8 bg-yellow-500 rounded-full ">
            <MdCasino className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="mt-8">
        <p className="text-xl font-semibold my-2">
          {item.type === "mantenimiento"
            ? "Mantenimiento"
            : item.type === "movimiento"
            ? "Movimiento de Componente"
            : "Movimiento de Máquina"}
        </p>
        {item.type === "mantenimiento" ? (
          <>
            <div className="flex space-x-2 text-gray-400 text-sm">
              <CgWebsite />
              <p>{item.tipoMantenimiento}</p>
            </div>
            <div className="flex space-x-2 text-gray-400 text-sm my-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p>{item.fecha.toLocaleDateString()}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Número de Serie</p>
              <p className="text-sm text-gray-500">{item.nroSerieMaquina}</p>
            </div>
            {item.nombreMaquina && (
              <div className="my-1">
                <p className="font-semibold text-base mb-1">Nombre Máquina</p>
                <p className="text-sm text-gray-500">{item.nombreMaquina}</p>
              </div>
            )}
            {item.ubicacionMaquina && (
              <div className="my-1">
                <p className="font-semibold text-base mb-1">Ubicación</p>
                <p className="text-sm text-gray-500">
                  {item.ubicacionMaquina}
                </p>
              </div>
            )}
            {item.descripcion && (
              <div className="my-1">
                <p className="font-semibold text-base mb-1">Descripción</p>
                <p className="text-gray-700">
                  {item.descripcion.length > 10
                    ? `${item.descripcion.slice(0, 10)}...`
                    : item.descripcion}
                  <button
                    onClick={() => handleDescriptionClick(item.descripcion)}
                    className="text-blue-500 underline ml-2"
                  >
                    Ver más
                  </button>
                </p>
              </div>
            )}
            {item.archivo?.url && (
              <div className="my-1">
                <p className="font-semibold text-base mb-1">Evidencia</p>
                <a
                  href={item.archivo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Ver Archivo
                </a>
              </div>
            )}
          </>
        ) : item.type === "movimiento" ? (
          <>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Nombre Componente</p>
              <p className="text-sm text-gray-500">{item.nombreComponente}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Serial Componente</p>
              <p className="text-sm text-gray-500">{item.serialComponente}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">
                Serial Máquina Inicial
              </p>
              <p className="text-sm text-gray-500">{item.oldMaquinaSerial}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">
                Serial Máquina Final
              </p>
              <p className="text-sm text-gray-500">{item.newMaquinaSerial}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">
                Fecha de Transferencia
              </p>
              <p className="text-sm text-gray-500">
                {item.fecha.toLocaleDateString()}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Serial Máquina</p>
              <p className="text-sm text-gray-500">{item.serialMaquina}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Marca Máquina</p>
              <p className="text-sm text-gray-500">{item.marcaMaquina}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Casino Inicial</p>
              <p className="text-sm text-gray-500">{item.oldCasinoNombre}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Casino Final</p>
              <p className="text-sm text-gray-500">{item.newCasinoNombre}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">
                Fecha de Transferencia
              </p>
              <p className="text-sm text-gray-500">
                {item.fecha.toLocaleDateString()}
              </p>
            </div>
          </>
        )}
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => deleteItem(item._id, item.type)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default MovimientoMaquinaCard;
