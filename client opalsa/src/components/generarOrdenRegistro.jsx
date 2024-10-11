import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useMaquinas } from "../context/MaquinasContext"; // Usamos la búsqueda por número de serie

const GenerarOrden = () => {
  const { user } = useAuth(); // Obtén el usuario autenticado desde el contexto
  const { buscarMaquinaPorSerie } = useMaquinas(); // Función para buscar la máquina por número de serie
  const [nroSerieMaquina, setNroSerieMaquina] = useState(""); // Para almacenar el número de serie ingresado
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState(null); // Aquí almacenaremos la máquina seleccionada como un objeto completo
  const [descripcionOrden, setDescripcionOrden] = useState("");
  const [tipoDeMantenimiento, setTipoDeMantenimiento] = useState([]); // Tipo de mantenimiento puede ser un array vacío inicialmente
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar la visualización del spinner
  const [isSearching, setIsSearching] = useState(false); // Estado para mostrar la búsqueda

  const fechaOrden = new Date().toISOString().split("T")[0]; // Fecha actual en formato ISO

  // Manejar la búsqueda de la máquina por número de serie
  const handleSerieChange = async (e) => {
    const selectedSerie = e.target.value.trim();
    setNroSerieMaquina(selectedSerie);

    if (selectedSerie) {
      setIsSearching(true);
      try {
        console.log("Buscando en el backend la máquina con serie:", selectedSerie); // Debugging
        const selectedMaquina = await buscarMaquinaPorSerie(selectedSerie); // Realiza la búsqueda en el backend

        if (selectedMaquina) {
          setMaquinaSeleccionada(selectedMaquina);
          setError(null); // Limpia los errores si todo va bien
          console.log("Máquina encontrada en el backend:", selectedMaquina); // Debugging
        } else {
          setError(`No se encontró la máquina con número de serie: ${selectedSerie}`);
          setMaquinaSeleccionada(null);
        }
      } catch (err) {
        console.error("Error al buscar la máquina:", err);
        setError("Error al buscar la máquina. Inténtalo de nuevo.");
      } finally {
        setIsSearching(false);
      }
    } else {
      setMaquinaSeleccionada(null); // Limpiar la selección si no se ingresa un número de serie válido
      setError(null);
    }
  };

  const handleTipoMantenimientoChange = (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setTipoDeMantenimiento(selectedValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Activa el spinner de carga

    if (!descripcionOrden || !maquinaSeleccionada || tipoDeMantenimiento.length === 0) {
      setError("Todos los campos son obligatorios.");
      setIsSubmitting(false); // Desactiva el spinner de carga si hay un error
      return;
    }

    const nuevaOrden = {
      descripcionOrden,
      nroSerieMaquina: maquinaSeleccionada.nroSerieMaquina,
      marcaMaquina: maquinaSeleccionada.marcaMaquina,
      ubicacionMaquina: maquinaSeleccionada.ubicacionMaquina,
      usuario: user.username,
      tipoDeMantenimiento,
      componentesAsignados: [],
      componentesSobrantes: [],
    };

    try {
      await axios.post("http://localhost:4000/api/ordenes", nuevaOrden);
      setSuccessMessage("Orden enviada exitosamente.");
      setDescripcionOrden("");
      setNroSerieMaquina("");
      setMaquinaSeleccionada(null);
      setTipoDeMantenimiento([]);
      setError(null);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      setError("No se pudo crear la orden. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false); // Desactiva el spinner después de completar la operación
    }
  };

  const tipoMantenimientoOptions = [
    { value: "preventivo", label: "Preventivo" },
    { value: "correctivo", label: "Correctivo" },
    { value: "predictivo", label: "Predictivo" },
    { value: "software", label: "Software" },
    { value: "estético", label: "Estético" },
  ];

  const isMaquinaValida = maquinaSeleccionada && maquinaSeleccionada.ubicacionMaquina;

  return (
    <div className="container mx-auto my-4 px-4 lg:px-20">
      <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
        <div className="flex justify-center">
          <h1 className="font-bold uppercase text-3xl md:text-4xl text-center">
            Solicitar una Orden
          </h1>
        </div>
        {isSubmitting && (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75 z-50">
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
        {isSearching && <p></p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2">
              Descripción de la Orden
            </label>
            <textarea
              value={descripcionOrden}
              onChange={(e) => setDescripcionOrden(e.target.value)}
              maxLength={1000}
              className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              placeholder="Solicita una orden aquí (máx. 1000 caracteres)"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
            <div className="mt-4 relative">
              <label className="block text-gray-700 font-bold mb-2">
                Número de Serie de la Máquina
              </label>
              <input
                type="text"
                value={nroSerieMaquina}
                onChange={handleSerieChange}
                className={`w-full mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                  isMaquinaValida ? "bg-green-200" : "bg-gray-100"
                } text-gray-900`}
                placeholder="Ingrese el número de serie de la maquina"
              />
              {isMaquinaValida && (
                <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600 font-bold text-xl">
                  ✔
                </span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-400 font-bold mb-2">
                Ubicación de la Máquina
              </label>
              <input
                type="text"
                value={maquinaSeleccionada ? maquinaSeleccionada.ubicacionMaquina : ""}
                readOnly
                className={`w-full mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline ${
                  isMaquinaValida ? "bg-green-200" : "bg-gray-100"
                } text-gray-900 font-semibold`}
                placeholder="Este campo se llenará automáticamente"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-bold mb-2">
                Fecha de Orden
              </label>
              <input
                type="date"
                value={fechaOrden}
                readOnly
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-bold mb-2">
                Tipo de Procedimiento
              </label>
              <Select
                isMulti
                value={tipoDeMantenimiento.map((value) =>
                  tipoMantenimientoOptions.find((option) => option.value === value)
                )}
                onChange={handleTipoMantenimientoChange}
                options={tipoMantenimientoOptions}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Selecciona los tipos de procedimiento"
              />
            </div>
          </div>
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
              {successMessage}
            </div>
          )}
          <div className="mt-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-white p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerarOrden;
