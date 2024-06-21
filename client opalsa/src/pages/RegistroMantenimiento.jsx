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
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <UserHeader />
      <div className="flex justify-center items-start p-4 gap-4">
        <div className="w-1/2 p-4 bg rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Registro de Mantenimiento</h2>
          <MantenimientoRegistro />
        </div>
        <div className="w-1/2 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Crear Recordatorio</h2>
          <CrearRecordatorio usuario={user} onRecordatorioCreado={handleRecordatorioCreado} />
        </div>
      </div>
    </div>
  );
};

export default RegistroMantenimiento;
