import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const CrearNotificacion = () => {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaRecordatorio, setFechaRecordatorio] = useState("");
  const [documentoRecordatorio, setDocumentoRecordatorio] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setDocumentoRecordatorio(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("fechaRecordatorio", fechaRecordatorio);
    formData.append("usuario", user.username);
    formData.append("documentoRecordatorio", documentoRecordatorio);

    try {
      const response = await axios.post("/recordatorios", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Recordatorio creado:", response.data);
      setError(null);
      setSuccessMessage("Notificación creada exitosamente");
      setTitulo("");
      setDescripcion("");
      setFechaRecordatorio("");
      setDocumentoRecordatorio(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error al crear recordatorio:", error);
      setError(
        "Error al crear el recordatorio. Por favor, inténtalo de nuevo."
      );
      setSuccessMessage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto my-4 px-4 lg:px-20">
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
      <div className="w-full p-6 my-4 lg:w-8/12 lg:p-12 rounded-2xl shadow-2xl bg-white mx-auto">
        <div className="flex justify-center">
          <h1 className="font-bold uppercase text-3xl md:text-4xl text-center">
            Recordatorios para el administrador
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 mt-5">
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">
                Título
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                maxLength={100}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                placeholder="Título (máx. 100 caracteres)"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={1000}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline h-32"
                placeholder="Descripción (máx. 1000 caracteres)"
                required
              ></textarea>
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">
                Fecha de Recordatorio
              </label>
              <input
                type="date"
                value={fechaRecordatorio}
                onChange={(e) => setFechaRecordatorio(e.target.value)}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-bold mb-2">
                {"Documento (Opcional)"}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          {/* Mensajes de éxito o error */}
          <div className="mt-5">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                <p>{successMessage}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="uppercase text-sm font-bold tracking-wide bg-blue-900 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearNotificacion;
