import React from "react";
import Navbar from "../components/Navbar";
import MantenimientosList from "../components/mantenimientoLista";
import MovimientosLista from "../components/MovimientosLista";

function Historial() {
  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
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
