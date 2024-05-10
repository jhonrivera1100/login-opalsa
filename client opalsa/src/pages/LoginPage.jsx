import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import React, { useEffect } from "react";

 export default function LoginPage() {

  const {register,handleSubmit,formState:{errors}} = useForm()
  const {signin,errors: signinErrors,isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signin(data); // Iniciar sesión con los datos del formulario
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setLoginError("Credenciales inválidas. Por favor, inténtalo de nuevo.");
    }
  });

  // Redirigir al usuario a la página de inicio si está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/HomePage");
    }
  }, [isAuthenticated, navigate]);


  return (
    <div className="flex  h-[calc(100vh-100px)] items-center justify-center ">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
      {
    signinErrors.map((error,i)=>(
        <div className='bg-red-500 p-2 text-white text-center my-2' key={i}>
            {error}
        </div>
    ))
}
<h1 className="text-3xl font-bold">Login</h1>

      <form onSubmit={onSubmit}>

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
    Iniciar Sesion 
</button>


</form>
<p className="flex gap-x-2 justify-between ">
  ¿no tienes una cuenta aun? <Link  className="text-sky-500" to="/register">Registrate </Link>
</p>
      </div>
          </div>
          
  )
}
