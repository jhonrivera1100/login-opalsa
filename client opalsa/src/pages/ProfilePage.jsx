

import React from 'react';
import Navbar from '../components/Navbar';
import Perfil from '../components/perfil'; // Importa el componente Perfil
function ProfilePage() {
  return (
    <div className="font-poppins">
      <Navbar /> {/* Componente Navbar */}
      <Perfil /> {/* Componente Perfil */}
    </div>
  );
}

export default ProfilePage;
