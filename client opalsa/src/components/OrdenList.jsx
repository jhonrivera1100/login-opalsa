import React from "react";
import RespOrdenCard from "./OrdenCard";  // Importamos RespOrdenCard para usarlo aquí

const OrdenesList = ({ filteredOrdenes, formatDate, handleShowMore }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredOrdenes.length === 0 ? (
        <p>No se encontraron órdenes.</p>
      ) : (
        filteredOrdenes.map((orden) => (
          <RespOrdenCard
            key={orden._id}
            orden={orden}
            formatDate={formatDate}
            handleShowMore={handleShowMore}
          />
        ))
      )}
    </div>
  );
};

export default OrdenesList;
