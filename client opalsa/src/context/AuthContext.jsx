import { useState, createContext, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest, getUserDataRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro de un provider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log('Respuesta del login:', res.data); // Para verificar la estructura de la respuesta
  
      // Cambiamos de `_id` a `id` para obtener el identificador del usuario
      const userId = res.data.id;
  
      if (!userId) {
        throw new Error('No se encontró el ID del usuario en la respuesta');
      }
  
      setIsAuthenticated(true);
      setUser(res.data);
  
      // Hacer una solicitud para obtener los datos completos del usuario
      const userData = await getUserDataRequest(userId);
      setUser(userData.data);
  
      return res.data;
    } catch (error) {
      setErrors([error.response?.data?.message || 'Error al iniciar sesión']);
      throw error;
    }
  };
  
  
  

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      setLoading(true);
      const token = Cookies.get('token');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequest(token);
        if (res.data) {
          setIsAuthenticated(true);

          // Hacer una solicitud para obtener los datos completos del usuario
          const userData = await getUserDataRequest(res.data._id);
          setUser(userData.data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signup, signin, logout, loading, user, setUser, isAuthenticated, errors, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
