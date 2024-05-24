import React from "react";
import Navbar from "../components/Navbar"; // Importa el componente Navbar
import SearchBar from "../components/SearchBar"; // Importa el componente SearchBar
import SeccionesHome from "../components/SeccionesHome";

function HomePage() {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <Navbar /> {/* Componente Navbar */}
      <SearchBar /> {/*  Componente SearchBar */}
      <SeccionesHome></SeccionesHome>
    </div>
  );
}

export default HomePage;