import React from "react";

function MaquinaCard({ maquina }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg mx-4 my-4">
      <img src={maquina.imgMaquina} alt={maquina.nombreMaquina} className="w-full" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{maquina.nombreMaquina}</div>
        <p className="text-gray-700 text-base">
          <strong>Número de Serie:</strong> {maquina.nroSerieMaquina}<br />
          <strong>Modelo:</strong> {maquina.modeloMaquina}<br />
          <strong>Marca:</strong> {maquina.marcaMaquina}<br />
          <strong>Software:</strong> {maquina.softwareMaquina}<br />
          <strong>Juego:</strong> {maquina.juegoMaquina}<br />
          <strong>Estado:</strong> {maquina.estadoMaquina}<br />
          <strong>Descripción:</strong> {maquina.descripcionMaquina}<br />
          <strong>Ubicación:</strong> {maquina.ubicacionMaquina}<br />
          <strong>Fecha de Instalación:</strong> {maquina.fechaInstalacionMaquina}<br />
          <strong>Proveedor:</strong> {maquina.proveedorMaquina}<br />
        </p>
      </div>
    </div>
  );
}

export default MaquinaCard;
