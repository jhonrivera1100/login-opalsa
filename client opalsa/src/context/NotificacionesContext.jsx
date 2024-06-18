// context/NotificacionesContext.jsx
import React, { createContext, useState } from 'react';

// Crea el contexto
export const NotificacionesContext = createContext();

// Proveedor del contexto
export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  const agregarNotificacion = (notificacion) => {
    setNotificaciones([...notificaciones, notificacion]);
  };

  return (
    <NotificacionesContext.Provider value={{ notificaciones, agregarNotificacion }}>
      {children}
    </NotificacionesContext.Provider>
  );
};
