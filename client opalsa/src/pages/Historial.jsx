import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import UserHeader from "../components/UserHeader";
import MantenimientosList from "../components/mantenimientoLista";

function Historial() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar /> {/* Componente Navbar */}
      <UserHeader /> {/* Componente UserHeader */}
      <div className="w-[600px] h-[800px]">
          <MantenimientosList />
        </div>
    </div>
  );
}

export default Historial;