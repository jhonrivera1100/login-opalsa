import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    try {
      const loggedInUser = await signin(data);
      if (loggedInUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/admin"); // Asegúrate de que esta ruta exista
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setLoginError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/admin"); // Asegúrate de que esta ruta exista
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div
  className="min-h-screen bg-cover bg-center flex flex-col justify-center sm:py-12"
  style={{ backgroundImage: `url("https://res.cloudinary.com/dtqiwgbbp/image/upload/v1729280502/apgft6gkdtuetbblmbdq.jpg")` }} // Aquí usamos la imagen importada
>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
          <div className="flex flex-col justify-center mb-4">
              
              <img src="https://res.cloudinary.com/dtqiwgbbp/image/upload/v1729095891/wxgrdw88ivy686xsojne.png" alt="Logo" className="w-70 h-44 " /> {/* Aquí está el logo */}
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-4">Iniciar Sesión</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                {loginError && (
                  <div className="bg-red-500 p-2 text-white text-center my-2">
                    {loginError}
                  </div>
                )}
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Email address"
                      {...register("email", { required: true })}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                    {errors.email && (
                      <p className="text-red-500 mt-2">Email es requerido</p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Password"
                      {...register("password", { required: true })}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                    {errors.password && (
                      <p className="text-red-500 mt-2">Password es requerido</p>
                    )}
                  </div>
                  <div className="relative">
                    <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200">Iniciar Sesión</button>
                  </div>
                </form>
                <p className="flex gap-x-2 text-gray-700 justify-between mt-6">
                  ¿No tienes una cuenta aún? <Link className="text-blue-500" to="/register">Regístrate</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
