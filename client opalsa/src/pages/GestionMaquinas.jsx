import React from "react";
import Navbar from "../components/Navbar"; // Importa el componente Navbar
import SearchBar from "../components/SearchBar"; // Importa el componente SearchBar
import SeccionesHome from "../components/SeccionesHome";
import UserHeader from "../components/UserHeader"; // Importa el componente UserHeader

function GestionMaquinas() {
  return (
    <div>
      <Navbar /> {/* Componente Navbar */}
      <UserHeader /> {/* Componente UserHeader */}
      <SearchBar /> {/* Componente SearchBar */}
      <SeccionesHome />
      {/* Aquí puedes agregar el contenido específico para la gestión de máquinas */}
    </div>
  );
}

export default GestionMaquinas;
