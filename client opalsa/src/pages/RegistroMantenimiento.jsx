import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CrearRecordatorio from "../components/NotificacionesRegistro";
import MantenimientoRegistro from '../components/MantenimientosRegistro';
import GenerarOrden from '../components/generarOrdenRegistro';
import { useAuth } from "../context/AuthContext";

const RegistroMantenimiento = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState('mantenimiento');

  const handleRecordatorioCreado = (nuevoRecordatorio) => {
    console.log("Nuevo recordatorio creado:", nuevoRecordatorio);
  };

  const handleGenerarOrden = (nuevaOrden) => {
    console.log("Nueva orden generada:", nuevaOrden);
  };

  const handleShowForm = (formType) => {
    setShowForm(formType);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <header className="flex items-center justify-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          REPORTES PARA<span className="text-sidebar-100 drop-shadow-xl"> ADMINISTRADOR</span>
        </h1>
      </header>
      <div className="flex justify-center space-x-4 my-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleShowForm('mantenimiento')}
        >
          Mantenimientos
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleShowForm('notificacion')}
        >
          Recordatorio
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleShowForm('orden')}
        >
         Generar Orden
        </button>
      </div>
      <div>
        {showForm === 'mantenimiento' && <MantenimientoRegistro />}
        {showForm === 'notificacion' && (
          <CrearRecordatorio usuario={user} onRecordatorioCreado={handleRecordatorioCreado} />
        )}
        {showForm === 'orden' && <GenerarOrden usuario={user} onOrdenCreada={handleGenerarOrden}/>}
      </div>
    </div>
  );
};

export default RegistroMantenimiento;
