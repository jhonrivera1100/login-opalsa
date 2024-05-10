import {useForm} from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';

function RegisterPage() {
    const {register, handleSubmit,formState:{errors}} = useForm();
    const {signup, isAuthenticated,errors: registerErrors} = useAuth();
const navigate = useNavigate();
const [isUserRegistered, setIsUserRegistered] = useState(false); 

useEffect(() => {
    if (isUserRegistered && !isAuthenticated) {
      // El usuario se registró pero aún no ha iniciado sesión, no hacer nada
    } else if (isUserRegistered && isAuthenticated) {
      // El usuario se registró y está autenticado, redirigir al formulario de inicio de sesión
      navigate('/login');
    }
  }, [isUserRegistered, isAuthenticated, navigate]);



const onSubmit = handleSubmit(async (values) => {
    try {
      await signup(values); // Realizar el registro con los datos del formulario
      setIsUserRegistered(true); // Establecer el estado de registro exitoso
    } catch (error) {
      console.error('Error al registrar:', error);
      // Manejar el error de registro aquí (podrías mostrar un mensaje de error general)
    }
  });


return (
    <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
    <div className=' bg-zinc-800 max-w-md p-10 rounded-md'>
{
    registerErrors.map((error,i)=>(
        <div className='bg-red-500 p-2' key={i}>
            {error}
        </div>
    ))
}


<h1 className='text-3xl font-bold my-2'>
    Registrarse
</h1>

        <form onSubmit={onSubmit}>
        <input type="text" {...register("username",{required:true})}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' 
        placeholder='Nombre de Usuario'
        />

{errors.username &&(
    <p className='text-red-500'>Username es requerido</p>
)}


        <input type="email" {...register("email",{required:true})}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
        placeholder='Email'
        />


{errors.email &&(
    <p className='text-red-500'>email es requerido</p>
)}

        <input type="password" {...register("password",{required:true})}
        className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2' 
        placeholder='Contraseña'
        />


{errors.password &&(
    <p className='text-red-500'>Password es requerido</p>
)}


        <button type='submit' className='bg-sky-500 text-white px-4 rounded-md my-2'>
            Registrarse 
        </button>


        </form>
        <p className="flex gap-x-2 justify-between ">
  ¿ya tienes una cuenta? <Link  className="text-sky-500" to="/login">Iniciar Sesion </Link>
</p>
    </div>
    </div>
)
}

export default  RegisterPage;
