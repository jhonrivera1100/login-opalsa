import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import HomePage from "./pages/HomePage"
import ProtectedRoute from "./ProtectedRoute"
import Historial from "./pages/Historial"
import RegistroMantenimiento from "./pages/RegistroMantenimiento"
import GestionMaquinas from "./pages/GestionMaquinas" 




function App() {
  return (
    <AuthProvider>
    <BrowserRouter> 
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      


      <Route element={<ProtectedRoute/>}>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/GestionMaquinas' element={<GestionMaquinas/>}/>
      <Route path='/Historial' element={<Historial/>}/>
      <Route path='/RegistroMantenimiento' element={<RegistroMantenimiento/>}/>
      <Route path='/profile' element={<ProfilePage/>}/>
      </Route>
      
    </Routes>
      </BrowserRouter>
      </AuthProvider>
  )
}

export default App;
