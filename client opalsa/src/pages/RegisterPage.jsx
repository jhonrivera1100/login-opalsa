import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (isUserRegistered && isAuthenticated) {
      navigate('/login');
    }
  }, [isUserRegistered, isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup(values);
      setIsUserRegistered(true);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-4">Registrarse</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                {registerErrors.map((error, i) => (
                  <div className="bg-red-500 p-2 text-white text-center my-2" key={i}>
                    {error}
                  </div>
                ))}
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
                      <p className="text-red-500 mt-2">Nombre y Apellido son requeridos</p>
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
                      {...register("email", { required: true })}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email
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
                      placeholder="Contraseña"
                      {...register("password", { required: true })}
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Contraseña
                    </label>
                    {errors.password && (
                      <p className="text-red-500 mt-2">Password es requerido</p>
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
                      <p className="text-red-500 mt-2">Número de Cédula es requerido</p>
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
                    <button className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200">
                      Registrarse
                    </button>
                  </div>
                </form>
                <p className="flex gap-x-2 text-gray-700 justify-between mt-6">
                  ¿Ya tienes una cuenta? <Link className="text-blue-500" to="/login">Iniciar Sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
