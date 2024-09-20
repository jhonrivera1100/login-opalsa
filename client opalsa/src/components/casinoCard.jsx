import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Asegúrate de importar FontAwesomeIcon
import { faMapMarkerAlt, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';

function CasinoCard({ casino, onVerMas, onVerDocumentos }) {
  const handleVerDocumentos = () => {
    console.log(casino); // Revisa aquí que los datos estén disponibles y correctos
    onVerDocumentos(casino);
  };
  
  return (
    <div className="w-full sm:w-72 max-w-sm bg-white border border-gray-200 my-1 rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <div className="relative">
        <img 
          src={casino.imgCasino.url} 
          alt={casino.nombreCasino} 
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>
      <div className="flex flex-col items-center p-4">
        <h2 className="text-xl font-bold text-gray-900 text-center">{casino.nombreCasino}</h2>
        <p className="text-sm text-gray-500 text-center flex items-center">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {casino.ciudadCasino}
        </p>
        <p className="text-sm text-gray-500 text-center flex items-center">
          <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2" />
          {casino.direccionCasino}
        </p>
        <div className="flex mt-4">
          <button 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={onVerMas}
          >
            Ver más
          </button>
          <button
            className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            onClick={handleVerDocumentos}
          >
            Documentacion
          </button>
        </div>
      </div>
    </div>
  );
}

export default CasinoCard;
