import React from "react";
import Navbar from "../components/Navbar";
import MantenimientosList from "../components/mantenimientoLista";
import MovimientosLista from "../components/MovimientosLista";

function Historial() {
  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
    
      <header className="flex items-center justify-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
        MANTENIMIENTOS<span className="text-sidebar-100 drop-shadow-xl"> Y MOVIMIENTOS</span>
        </h1>
      </header>
      <div className="flex items-center justify-end">
          <MantenimientosList />
        </div>
        <div className="flex items-center justify-end">
        <MovimientosLista/>
        </div>
    </div>
  );
}

export default Historial;
