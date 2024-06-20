import React from "react";
import Navbar from "../components/Navbar";
import UserHeader from "../components/UserHeader";
import MantenimientosList from "../components/mantenimientoLista";
import HistorialComponentes from "../components/MovimientosLista";

function Historial() {
  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
      <UserHeader /> {/* Componente UserHeader */}
      <div className="flex items-center justify-end">
          <MantenimientosList />
        </div>
        <div className="flex items-center justify-end">
        <HistorialComponentes/>
        </div>
    </div>
  );
}

export default Historial;
