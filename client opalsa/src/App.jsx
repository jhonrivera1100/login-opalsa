// src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import Historial from "./pages/Historial";
import RegistroMantenimiento from "./pages/RegistroMantenimiento";
import GestionMaquinas from "./pages/GestionMaquinas";
import AppAdmin from "./pages/appAdmin";
import NotificacionesAdmin from "./pages/notificacionesAdmin";
import GestionUsuarios from "./pages/GestionUsuarios";
import RegistrarNotifi from "./pages/registrarNotifiAdm";
import { MaquinasProvider } from "./context/MaquinasContext"
import { ElementosProvider } from "./context/ElementosContext";
import { ComponentesProvider } from "./context/ComponentesContext";
import { NotificacionesProvider } from "./context/NotificacionesContext";
import { CasinosProvider } from "./context/CasinosContext";
import ProtectedAdmin from "./protectedAdmin"; // Importa el ProtectedAdmin

function App() {
  return (
    <AuthProvider>
      <CasinosProvider>
        <ElementosProvider>
        <MaquinasProvider>
          <ComponentesProvider>
            <NotificacionesProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/registroNotifi" element={<RegistrarNotifi />} />
                    <Route element={<ProtectedAdmin />}>
                      <Route path="/admin" element={<AppAdmin />} />
                      <Route path="/Usuarios" element={<GestionUsuarios />} />
                      <Route path="/notifi" element={<NotificacionesAdmin />} />
                    <Route path="/Historial" element={<Historial />} />
                    <Route path="/GestionMaquinas" element={<GestionMaquinas />} />
                    <Route path="/RegistroMantenimiento" element={<RegistroMantenimiento />} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </NotificacionesProvider>
          </ComponentesProvider>
        </MaquinasProvider>
        </ElementosProvider>
      </CasinosProvider>
    </AuthProvider>
  );
}

export default App;
