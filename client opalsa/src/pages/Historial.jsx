import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import UserHeader from "../components/UserHeader";
import MantenimientosList from "../components/mantenimientoLista";
import HistorialComponentes from "../components/movimientosLista";

function Historial() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar /> {/* Componente Navbar */}
      <UserHeader /> {/* Componente UserHeader */}
      <div className="flex items-center justify-end">
          <MantenimientosList />
        </div>
        <div>
        <HistorialComponentes/>
        </div>
    </div>
  );
}

export default Historial;