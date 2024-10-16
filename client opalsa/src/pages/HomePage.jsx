import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaTools } from "react-icons/fa"; // Ícono de "Reportes"
import { AiFillContainer } from "react-icons/ai"; // Ícono de "Respuestas de Orden"

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Componente Navbar */}

      {/* Imagen de fondo con texto centrado */}
      <section
        className="relative bg-cover bg-center h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dtqiwgbbp/image/upload/v1727471920/wmijfcuvu84ysxyniaew.jpg')`,
        }}
      >
        {/* Capa oscura para opacidad */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Texto centrado sobre la imagen */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">BIENVENIDO A OPALSA APP</h1>
          <p className="text-lg md:text-2xl">
            CONOCE MÁS SOBRE EL GESTOR DE SALAS Y PROCEDIMIENTOS DE OPALSA
          </p>
        </div>
      </section>

      <main className="container mx-auto py-12 w-[80%]">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1 con el ícono de Reportes en la esquina izquierda */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
            {/* Ícono de Reportes en la esquina izquierda */}
            <FaTools className="absolute top-4 left-4 text-blue-600 text-4xl" />

            <div className="p-6 pl-16">
              <h3 className="text-2xl text-blue-600 font-bold mb-2">Seccion de Reportes</h3>
              <p className="text-gray-700">
                En esta sección, se permite registrar los mantenimientos realizados, generar solicitudes de órdenes para la ejecución de procedimientos específicos, y crear recordatorios dirigidos al administrador para la gestión eficiente de las tareas operativas.
              </p>
            </div>
          </div>

          {/* Card 2 con el ícono de Respuestas de Orden en la esquina izquierda */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden relative">
            {/* Ícono de Respuestas de Orden en la esquina izquierda */}
            <AiFillContainer className="absolute top-4 left-4 text-blue-600 text-4xl" />

            <div className="p-6 pl-16">
              <h3 className="text-2xl text-blue-600 font-bold mb-2">Seccion de Respuestas de orden</h3>
              <p className="text-gray-700">
              En esta sección podrás visualizar todas las órdenes que has generado, organizadas según su estado actual. Adicionalmente, aquí recibirás las respuestas del administrador a cada una de tus solicitudes. Es recomendable revisar esta sección con regularidad si tienes órdenes pendientes de respuesta.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-900 rounded text-white py-12 shadow-2xl">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Tu Perfil</h2>
            <p className="mb-6">
              En la sección de perfil encontrarás todos tus datos los cuales
              podrás modificar si lo ves necesario, recuerda siempre poner datos
              reales.
            </p>
            <Link to="/profile">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                Ver Perfil
              </button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Opalsa App. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
