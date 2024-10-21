import React , { useState } from "react";
import { FaTools } from "react-icons/fa";
import { MdAutoAwesomeMotion } from "react-icons/md";
import { MdOutlineHomeRepairService } from "react-icons/md";


const MovimientoMaquinaCard = ({ item, handleDescriptionClick, deleteItem }) => {
  // Formateo seguro de la fecha. Usamos la propiedad correspondiente a cada tipo de movimiento.
  const [tooltipId, setTooltipId] = useState(null);
  const formattedDate = item.fechaMantenimiento
    ? new Date(item.fechaMantenimiento).toLocaleDateString()
    : item.fechaTransferencia || item.fechaTransferenciaElm
    ? new Date(item.fechaTransferencia || item.fechaTransferenciaElm).toLocaleDateString()
    : "Fecha no disponible";

  // Determinamos si es un mantenimiento, un movimiento de máquina, de componente o de elemento
  const isMantenimiento = item.tipoMantenimiento !== undefined;
  const isMovimientoMaquina = item.oldCasinoNombre && item.newCasinoNombre; // Movimientos de máquinas
  const isMovimientoComponente = item.serialComponente && item.nombreComponente; // Movimientos de componentes
  const isMovimientoElemento = item.oldUbicacionNombre && item.newUbicacionNombre && item.codigoElemento; // Movimientos de elementos


  // Función para truncar texto a 25 caracteres
  const truncateText = (text) => {
    return text.length > 25 ? text.slice(0, 25) + "..." : text;
  };


   // Renderiza un texto con tooltip
   const renderTextWithTooltip = (text, id) => (
    <div
        className="relative lg:flex lg:space-x-2 text-gray-400 text-sm"
        onMouseEnter={() => setTooltipId(id)}
        onMouseLeave={() => setTooltipId(null)}
    >
        <p>{truncateText(text)}</p>
        {tooltipId === id && (
            <div
                className="absolute left-0 top-full mt-1 p-2 bg-black text-white text-sm rounded-md shadow-lg"
                style={{ zIndex: 10 }} // Asegura que el tooltip esté en la parte superior
            >
                {text}
            </div>
        )}
    </div>
);


  return (
    <div
      key={item._id}
      className="relative bg-white py-6 px-6 rounded-3xl w-[250px] shadow-xl m-4"
    >
      <div
        className={`text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl ${
          isMantenimiento
            ? "bg-green-500"
            : isMovimientoComponente
            ? "bg-blue-500"
            : isMovimientoMaquina
            ? "bg-yellow-500"
            : isMovimientoElemento
            ? "bg-orange-500"
            : "bg-gray-500"
        } left-4 -top-6`}
      >
        {isMantenimiento ? (
          <FaTools className="h-8 w-8" />
        ) : isMovimientoComponente || isMovimientoMaquina || isMovimientoElemento ? (
          <MdAutoAwesomeMotion className="h-8 w-8" />
        ) : null}
      </div>

      <div className="mt-8">
        <p className="text-xl font-semibold my-2">
          {isMantenimiento
            ? "Mantenimiento"
            : isMovimientoComponente
            ? "Movimiento de Componente"
            : isMovimientoMaquina
            ? "Movimiento de Máquina"
            : isMovimientoElemento
            ? "Movimiento de Elemento"
            : "Movimiento Desconocido"}
        </p>

        {/* Mantenimiento */}
        {isMantenimiento ? (
          <>
            <div className="flex space-x-2 text-gray-400 text-sm">
            <MdOutlineHomeRepairService className="w-5 h-5"/>
              <p>{item.tipoMantenimiento || "N/A"}</p>
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
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
              <p>{formattedDate}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Número de Serie</p>
              <p className="text-sm text-gray-500"> {renderTextWithTooltip(item.nroSerieMaquina || "N/A", `nroSerie-${item._id}`)}</p>
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
                <p className="text-sm text-gray-500">{item.ubicacionMaquina}</p>
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
            {/* Archivo (si existe) */}
            {item.archivo?.url && (
              <div className="my-2">
                <p className="font-semibold text-base mb-1">Archivo:</p>
                <a
                  href={item.archivo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Ver archivo adjunto
                </a>
              </div>
            )}
          </>
        ) : isMovimientoComponente ? (
          <>
            {/* Movimiento de Componente */}
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Nombre Componente</p>
              <p className="text-sm text-gray-500">{item.nombreComponente || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Serial Componente</p>
              <p className="text-sm text-gray-500"> {renderTextWithTooltip(item.serialComponente || "N/A", `nroSerie-${item._id}`)}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Serial Máquina Inicial</p>
              <p className="text-sm text-gray-500">{item.oldMaquinaSerial || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Serial Máquina Final</p>
              <p className="text-sm text-gray-500">{item.newMaquinaSerial || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Fecha de Transferencia</p>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </>
        ) : isMovimientoMaquina ? (
          <>
            {/* Movimiento de Máquina */}
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Serial Máquina</p>
              <p className="text-sm text-gray-500">{renderTextWithTooltip(item.serialMaquina || "N/A", `nroSerie-${item._id}`)}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Marca Máquina</p>
              <p className="text-sm text-gray-500">{item.marcaMaquina || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Casino Inicial</p>
              <p className="text-sm text-gray-500">{item.oldCasinoNombre || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Casino Final</p>
              <p className="text-sm text-gray-500">{item.newCasinoNombre || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Fecha de Transferencia</p>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </>
        ) : isMovimientoElemento ? (
          <>
            {/* Movimiento de Elemento */}
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Código Elemento</p>
              <p className="text-sm text-gray-500">{renderTextWithTooltip(item.codigoElemento || "N/A", `nroSerie-${item._id}`)}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Nombre Elemento</p>
              <p className="text-sm text-gray-500">{item.nombreElemento || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Ubicación Inicial</p>
              <p className="text-sm text-gray-500">{item.oldUbicacionNombre || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Ubicación Final</p>
              <p className="text-sm text-gray-500">{item.newUbicacionNombre || "N/A"}</p>
            </div>
            <div className="my-1">
              <p className="font-semibold text-base mb-1">Fecha de Transferencia</p>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Datos no disponibles</p>
        )}

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => deleteItem(item._id, 
            isMantenimiento 
            ? "mantenimiento" 
            : isMovimientoComponente 
            ? "movimiento" 
            : isMovimientoMaquina 
            ? "moviMaquina" 
            : "movimientoElemento")}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default MovimientoMaquinaCard;
