import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import UserHeader from "../components/UserHeader";
import MantenimientosList from "../components/mantenimientoLista";

function Historial() {
  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
      <UserHeader /> {/* Componente UserHeader */}
      <div className="flex items-center justify-end">
          <MantenimientosList />
        </div>
    </div>
  );
}

export default Historial;