import React from 'react';

const OrdenesFilter = ({ searchTerm, setSearchTerm, filterDate, setFilterDate }) => {
  return (
    <div className="mb-4 flex gap-4 flex justify-center pr-[00px]">
      <input
        type="text"
        placeholder="Buscar por número de orden"
        className="px-4 py-2 border rounded-lg w-[400px]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <input
        type="text"
        placeholder="dd/mm/aaaa"
        className="px-4 py-2 border rounded-lg"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
    </div>
  );
};

export default OrdenesFilter;
