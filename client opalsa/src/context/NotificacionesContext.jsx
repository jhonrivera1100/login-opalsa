import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const NotificacionesContext = createContext();

// Proveedor del contexto
export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    // Aquí podrías hacer una llamada a una API para obtener las notificaciones
    // Para este ejemplo, usaremos datos estáticos
    setNotificaciones([
      { user: { username: 'user1' }, message: 'Mensaje 1' },
      { user: { username: 'user2' }, message: 'Mensaje 2' },
    ]);
  }, []);

  return (
    <NotificacionesContext.Provider value={{ notificaciones }}>
      {children}
    </NotificacionesContext.Provider>
  );
};
