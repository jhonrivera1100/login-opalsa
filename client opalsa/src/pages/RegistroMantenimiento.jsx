import React from 'react';
import Navbar from '../components/Navbar';
import UserHeader from '../components/UserHeader';
import CrearRecordatorio from "../components/NotificacionesRegistro";
import MantenimientoRegistro from '../components/MantenimientosRegistro';
import { useAuth } from "../context/AuthContext";

const RegistroMantenimiento = () => {
  const { user } = useAuth();

  const handleRecordatorioCreado = (nuevoRecordatorio) => {
    console.log("Nuevo recordatorio creado:", nuevoRecordatorio);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <UserHeader />
      <MantenimientoRegistro />
      <CrearRecordatorio usuario={user} onRecordatorioCreado={handleRecordatorioCreado} />
    </div>
  );
};

export default RegistroMantenimiento;
