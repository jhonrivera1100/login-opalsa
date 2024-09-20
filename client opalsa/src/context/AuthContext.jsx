import { useState, createContext, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
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
      setIsAuthenticated(true);
      setUser(res.data);
      return res.data;
    } catch (error) {
      setErrors([error.response.data.message]);
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
      setLoading(true);  // Asegúrate de iniciar la carga aquí
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
          setUser(res.data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);  // Asegúrate de finalizar la carga aquí
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
