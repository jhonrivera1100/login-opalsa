import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NotificacionesContext } from '../context/NotificacionesContext'; // Importar el contexto

const NotificacionesAdmin = () => {
  const { user } = useContext(AuthContext);
  const notificacionesContext = useContext(NotificacionesContext);

  if (!notificacionesContext) {
    return <div>Error: el contexto de notificaciones no está disponible.</div>;
  }

  const { notificaciones } = notificacionesContext;

  if (!notificaciones || notificaciones.length === 0) {
    return <div>No hay notificaciones disponibles.</div>;
  }

  return (
    <div>
      <h1>Notificaciones</h1>
      <ul>
        {notificaciones.map((notificacion, index) => {
          // Verifica si notificacion o notificacion.user es null
          if (!notificacion || !notificacion.user) {
            return (
              <li key={index}>
                <span>Usuario desconocido</span>
              </li>
            );
          }
          return (
            <li key={index}>
              <span>{notificacion.user.username}</span>: {notificacion.message}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NotificacionesAdmin;
