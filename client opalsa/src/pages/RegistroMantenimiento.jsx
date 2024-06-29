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
