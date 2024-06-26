import React from 'react';

function CasinoCard({ casino, onVerMas }) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 my-1 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-900 transition-transform duration-300 hover:-translate-y-2">
      <div className="relative">
        <img 
          src={casino.imgCasino.url} 
          alt={casino.nombreCasino} 
          className="w-full h-48 object-cover rounded-t-lg" 
        />
      </div>
      <div className="flex flex-col items-center p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">{casino.nombreCasino}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{casino.ciudadCasino}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{casino.direccionCasino}</p>
        <div className="flex mt-4">
          <button 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={onVerMas}
          >
            Ver más
          </button>
          <a 
            href="#" 
            className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Contactar
          </a>
        </div>
      </div>
    </div>
  );
}

export default CasinoCard;
