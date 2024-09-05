import React from "react";
import { TiDelete } from "react-icons/ti";
import { FaRegUser } from "react-icons/fa";
import { GoDiscussionClosed } from "react-icons/go";
import { BsFileEarmarkText } from "react-icons/bs";

const NotificationCard = ({
  item,
  onOpenSobrantesModal,
  onDeleteItem,
  onAcceptOrder,
  onUserClick,
  onDescriptionClick,
  onOpenFile,
  handleCheckboxChange,
  handleCheckboxAceptar
}) => {
  return (
    <div
      key={item._id}
      className={`relative py-6 px-6 rounded-3xl w-[250px] my-4 shadow-xl ${
        item.type === "recordatorio"
          ? item.visto
            ? "bg-green-200"
            : "bg-white"
          : item.aceptado
          ? "bg-green-200"
          : "bg-white"
      }`}
    >
      <div
        className={`text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl ${
          item.type === "recordatorio" ? "bg-blue-500" : "bg-green-500"
        } left-4 -top-4`}
      >
        {item.type === "recordatorio" ? (
          <GoDiscussionClosed className="w-8 h-8" />
        ) : (
          <BsFileEarmarkText className="w-8 h-8" />
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 absolute top-4 right-4">
        {item.type === "recordatorio" && (
          <>
            <input
              type="checkbox"
              checked={item.visto}
              onChange={() => handleCheckboxChange(item._id, item.visto)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <label className="text-gray-600">Visto</label>
          </>
        )}
        {item.type === "orden" && (
          <>
            <input
              type="checkbox"
              checked={item.aceptado}
              onChange={() => handleCheckboxAceptar(item._id, item.aceptado)}
              className="form-checkbox h-5 w-5 text-green-600"
            />
            <label className="text-gray-600">Aceptado</label>
          </>
        )}
      </div>
      <div className="mt-8">
        <p className="text-xl font-semibold my-2">
          {item.type === "recordatorio" ? "Notificación" : "Solicitud de Orden"}
        </p>
        <div className="flex space-x-2 text-gray-400 text-sm">
          <FaRegUser
            className="h-5 w-5 cursor-pointer"
            onClick={() => onUserClick(item)}
          />
          <p
            className="cursor-pointer"
            onClick={() => onUserClick(item)}
          >
            {item.usuario ? (item.usuario.username.length > 8 ? `${item.usuario.username.substring(0, 8)}...` : item.usuario.username) : "Desconocido"}
          </p>
        </div>
        <div className="flex space-x-2 text-gray-400 text-sm my-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>{item.fecha.toLocaleDateString()}</p>
        </div>
        <div className="border-t-2"></div>
        <div className="mt-4">
          {item.type === "recordatorio" ? (
            <>
              <p className="text-gray-600 mb-2">
                <strong>Título:</strong> <br />
                {item.titulo}
              </p>
              <p
                className="text-gray-600 mb-2 cursor-pointer"
                onClick={() => onDescriptionClick(item)}
              >
                <strong>Descripción:</strong> <br />
                {item.descripcion.length > 10 ? `${item.descripcion.substring(0, 8)}...` : item.descripcion}
              </p>
              <div className="flex justify-center mt-9">
                {item.documentoRecordatorio?.length > 0 && (
                  <button
                    className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    onClick={() => onOpenFile(item.documentoRecordatorio[0].url)}
                  >
                    Ver Archivo
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <p
                className="text-gray-600 mb-2 cursor-pointer"
                onClick={() => onDescriptionClick(item)}
              >
                <strong>Orden:</strong> <br /> {item.descripcionOrden.length > 10 ? `${item.descripcionOrden.substring(0, 8)}...` : item.descripcionOrden}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Maquina Serial:</strong> <br /> {item.nroSerieMaquina}
              </p>
              <p className="text-gray-600 mb-2 ">
                <strong>Ubicación Maquina:</strong> <br />
                {item.ubicacionMaquina}
              </p>
              
              <p className="text-gray-600 pb-2">
                <strong>Partes Sobrantes:</strong> 
              </p>
              <ul>
                {item.componenteSobrantes.map((componente, index) => (
                  <li key={`${componente.serialComponente}-${index}`}>
                    {componente.nombreComponente} <br /> (Serial: {componente.serialComponente})
                  </li>
                ))}
                <li>{item.sobrantes}</li>
              </ul>
            </>
          )}
          <div className="flex justify-center mt-2 space-x-2">
            {item.type === "orden" && (
              <button
                className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-700 transition-colors duration-300"
                onClick={() => onAcceptOrder(item)}
              >
                Aceptar
              </button>
            )}
            <button
              className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-700 transition-colors duration-300"
              onClick={() => onDeleteItem(item._id, item.type)}
            >
              <TiDelete className="h-5 w-5 inline" />
              Eliminar
            </button>
          </div>
          <div className="flex justify-center mt-3">
            {item.type === "orden" && (
              <button
                onClick={() => onOpenSobrantesModal(item)}
                className="bg-sky-500 rounded-md py-1 px-4 text-white hover:bg-sky-700 transition-colors duration-300"
              >
                Sobrantes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
