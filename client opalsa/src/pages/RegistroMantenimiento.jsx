import React from 'react';
import Navbar from '../components/Navbar';
import CrearRecordatorio from "../components/NotificacionesRegistro";
import MantenimientoRegistro from '../components/MantenimientosRegistro';
import { useAuth } from "../context/AuthContext";

const RegistroMantenimiento = () => {
  const { user } = useAuth();

  const handleRecordatorioCreado = (nuevoRecordatorio) => {
    console.log("Nuevo recordatorio creado:", nuevoRecordatorio);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <header className="flex items-center justify-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
        REPORTES PARA<span className="text-sidebar-100 drop-shadow-xl"> ADMINISTRADOR</span>
        </h1>
      </header>
      <div>
          <MantenimientoRegistro />
        </div>
        <div>
          <CrearRecordatorio usuario={user} onRecordatorioCreado={handleRecordatorioCreado} />
          </div>
        </div>
  );
};

export default RegistroMantenimiento;
