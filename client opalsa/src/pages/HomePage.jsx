import React from "react";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 flex flex-col items-center">
        <div className="max-w-xl w-full flex items-center">
          {/* Aquí va la barra de búsqueda */}
          <input
            type="text"
            placeholder="Buscar..."
            className="border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-blue-300 w-full"
          />
          {/* Aquí va el botón de agregar */}
          <button className="bg-green-800 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full flex items-center text-sm transition-transform transform hover:scale-105"> Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
