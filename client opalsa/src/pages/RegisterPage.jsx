import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para el spinner

  useEffect(() => {
    if (isUserRegistered && isAuthenticated) {
      navigate("/login");
    }
  }, [isUserRegistered, isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true); // Activamos el spinner de carga
    try {
      // Intentamos registrar al usuario
      await signup(values);

      // Verificamos si no hay errores de validación en el formulario y no hay errores de registro
      if (
        Object.keys(errors).length === 0 &&
        (!registerErrors || registerErrors.length === 0)
      ) {
        // Si no hay errores, mostramos el mensaje de éxito
        setIsUserRegistered(true);
        setShowSuccessAlert(true);

        // Ocultamos el mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      } else {
        setIsUserRegistered(false);
        setShowSuccessAlert(false);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setIsUserRegistered(false);
      setShowSuccessAlert(false);
    } finally {
      setIsSubmitting(false); // Desactivamos el spinner de carga
    }
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center sm:py-12"
      style={{ backgroundImage: `url("https://res.cloudinary.com/dtqiwgbbp/image/upload/v1729280502/apgft6gkdtuetbblmbdq.jpg")` }} // Aquí usamos la imagen importada
    >
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            
            <div>
              <h1 className="text-2xl font-semibold mb-4">Registrarse</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                {/* Muestra errores de registro */}
                {registerErrors &&
                  registerErrors.length > 0 &&
                  registerErrors.map((error, i) => (
                    <div
                      className="bg-red-500 p-2 text-white text-center my-2"
                      key={i}
                    >
                      {error}
                    </div>
                  ))}

                {/* Muestra el mensaje de éxito solo si no hay errores */}
                {showSuccessAlert && (
                  <div className="bg-green-500 p-2 text-white text-center my-2">
                    Usuario Creado exitosamente
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="username"
                      name="username"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Nombre de Usuario"
                      {...register("username", { required: true })}
                    />
                    <label
                      htmlFor="username"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Nombre y Apellido
                    </label>
                    {errors.username && (
                      <p className="text-red-500 mt-2">
                        Nombre y Apellido son requeridos
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="email"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Email"
                      {...register("email", {
                        required: true,
                        pattern: /^\S+@\S+\.\S+$/,
                      })}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email
                    </label>
                    {errors.email && (
                      <p className="text-red-500 mt-2">
                        {errors.email.type === "pattern"
                          ? "Email no es válido"
                          : "Email es requerido"}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Contraseña"
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Contraseña
                    </label>
                    {errors.password && (
                      <p className="text-red-500 mt-2">
                        {errors.password.type === "minLength"
                          ? "La contraseña debe tener al menos 6 caracteres"
                          : "La contraseña es requerida"}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="cedula"
                      name="cedula"
                      type="number"
                      inputMode="numeric"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600 appearance-none"
                      placeholder="Cédula"
                      {...register("cedula", { required: true })}
                    />
                    <label
                      htmlFor="cedula"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Cédula
                    </label>
                    {errors.cedula && (
                      <p className="text-red-500 mt-2">
                        Número de Cédula es requerido
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="ciudad"
                      name="ciudad"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Ciudad"
                      {...register("ciudad", { required: true })}
                    />
                    <label
                      htmlFor="ciudad"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Ciudad
                    </label>
                    {errors.ciudad && (
                      <p className="text-red-500 mt-2">Ciudad es requerida</p>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="cargo"
                      name="cargo"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Cargo que ocupa actualmente"
                      {...register("cargo", { required: true })}
                    />
                    <label
                      htmlFor="cargo"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Cargo que ocupa actualmente
                    </label>
                    {errors.cargo && (
                      <p className="text-red-500 mt-2">Cargo es requerido</p>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200"
                      disabled={isSubmitting}
                    >
                      Registrarse
                    </button>
                  </div>
                </form>
                <p className="flex gap-x-2 text-gray-700 justify-between mt-6">
                  ¿Ya tienes una cuenta?{" "}
                  <Link className="text-blue-500" to="/login">
                    Iniciar Sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner de carga */}
      {isSubmitting && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75 z-50">
          <div className="relative flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <img
              src="https://res.cloudinary.com/dtqiwgbbp/image/upload/v1727359701/vjg0klgqxuqfiesshgdb.jpg"
              className="rounded-full h-28 w-28"
              alt="Loader"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
