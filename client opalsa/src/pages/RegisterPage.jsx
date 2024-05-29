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
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
      <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
        {registerErrors.map((error, i) => (
          <div className='bg-red-500 p-2' key={i}>
            {error}
          </div>
        ))}
        {showSuccessAlert && (
          <div className='bg-green-500 p-2'>
            Usuario Creado exitosamente
          </div>
        )}
        <h1 className='text-3xl text-white font-bold my-2'>
          Registrarse
        </h1>
        <form onSubmit={onSubmit}>
          <input type="text" {...register("username", { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Nombre de Usuario'
          />
          {errors.username && (
            <p className='text-red-500'>Username es requerido</p>
          )}
          <input type="email" {...register("email", { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Email'
          />
          {errors.email && (
            <p className='text-red-500'>Email es requerido</p>
          )}
          <input type="password" {...register("password", { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Contraseña'
          />
          {errors.password && (
            <p className='text-red-500'>Password es requerido</p>
          )}
          <input type="number" {...register("cedula", { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Cédula'
          />
          {errors.cedula && (
            <p className='text-red-500'>Número de Cédula es requerido</p>
          )}
          <input type="text" {...register("cargo", { required: true })}
            className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
            placeholder='Cargo que ocupa actualmente'
          />
          {errors.cargo && (
            <p className='text-red-500'>Cargo es requerido</p>
          )}
          <button type='submit' className='bg-sky-500 text-white px-4 rounded-md my-2'>
            Registrarse
          </button>
        </form>
        <p className="flex gap-x-2 text-white justify-between">
          ¿Ya tienes una cuenta? <Link className="text-sky-500" to="/login">Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;