import React from 'react';

function CasinoCard({ casino, onVerMas }) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 my-1 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-900 hover:-translate-y-2 transition-colors duration-300">
      <div className="relative">
        <img 
          src={casino.imgCasino.url} 
          alt={casino.nombreCasino} 
          className="w-full h-48 object-cover rounded-t-lg" 
        />
        <div className="absolute top-2 right-2">
          <button 
            id="dropdownButton" 
            data-dropdown-toggle="dropdown" 
            className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" 
            type="button"
          >
            <span className="sr-only">Open dropdown</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
            </svg>
          </button>
          <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2" aria-labelledby="dropdownButton">
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
              </li>
            </ul>
          </div>
        </div>
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
