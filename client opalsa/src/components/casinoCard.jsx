import React from 'react';

function CasinoCard({ casino }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <img src={casino.imgCasino.url} alt={casino.nombreCasino} className="w-full h-48 object-cover rounded-lg" />
      <h2 className="text-lg font-bold mt-2">{casino.nombreCasino}</h2>
      <p className="text-gray-600">{casino.ciudadCasino}</p>
      <p className="text-gray-600">{casino.direccionCasino}</p>
      <p className="text-gray-600">{casino.documentacionCasino}</p>
    </div>
  );
}

export default CasinoCard;
