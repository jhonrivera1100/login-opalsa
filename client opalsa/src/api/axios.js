import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // Usar la variable de entorno para la URL base
  withCredentials: true
});

export default instance;
