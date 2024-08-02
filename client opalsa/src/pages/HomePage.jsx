import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import notificar from "../assets/images/notificar.png";
import perfil from "../assets/images/perfil.png";
import actualizar from "../assets/images/actualizar datos.png";

function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,         
    autoplaySpeed: 2500,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Componente Navbar */}

      <main className="container mx-auto py-12 w-[80%]">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">¡Bienvenido a Opalsa App!</h2>
          <p className="text-lg">Conoce las salas de casinos con las que cuenta Opalsa y las máquinas con las que contamos actualmente.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Notificar al Administrador</h3>
              <p className="text-gray-700">Hazle saber al administrador si has hecho un cambio de algún componente o si una máquina ha sido trasladada, informa de los mantenimientos que se le han realizado a las máquinas.</p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Actualiza Datos</h3>
              <p className="text-gray-700">Puedes actualizar los datos de tu perfil si lo ves necesario gracias a su función Actualizar Datos.</p>
            </div>
          </div>
        </section>

        {/* Carrusel de imágenes */}
        <section className="mb-12">
          <Slider {...settings}>
            <div className="rounded-xl">
              <img src={notificar} alt="Imagen 1" className="w-full h-auto rounded-xl" />
            </div>
            <div>
              <img src={perfil} alt="Imagen 2" className="w-full h-auto rounded-xl" />
            </div>
            <div>
              <img src={actualizar} alt="Imagen 3" className="w-full h-auto rounded-xl" />
            </div>
          </Slider>
        </section>

        <section className="bg-blue-900 text-white py-12 shadow-2xl">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Tu Perfil</h2>
            <p className="mb-6">En la sección de perfil encontrarás todos tus datos los cuales podrás modificar si lo ves necesario, recuerda siempre poner datos reales.</p>
            <Link to="/profile">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">Ver Perfil</button>
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
