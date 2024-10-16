import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useElementos } from "../context/ElementosContext";
import { getCasinosRequest } from "../api/casinos";

function FormElemento({ closeModal }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { createElemento } = useElementos();
  const [casinos, setCasinos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para el spinner de carga

  const [formData, setFormData] = useState({
    nombreElemento: "",
    codigoElemento: "",
    marcaElemento: "",
    tipoElemento: "",
    ubicacionDeElemento: "",
    imgElemento: null,
    documentacionElemento: null,
  });

  useEffect(() => {
    const fetchCasinos = async () => {
      try {
        const response = await getCasinosRequest();
        setCasinos(response.data);
      } catch (error) {
        console.error("Error fetching casinos:", error);
      }
    };
    fetchCasinos();
  }, []);

  const handleInputChange = (event, isFile = false) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: isFile ? files[0] : value,
    }));
  };

  const onSubmit = async (data) => {
    setIsLoading(true); // Activamos el spinner de carga
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombreElemento", data.nombreElemento);
      formDataToSend.append("codigoElemento", data.codigoElemento);
      formDataToSend.append("marcaElemento", data.marcaElemento);
      formDataToSend.append("tipoElemento", data.tipoElemento);
      formDataToSend.append("ubicacionDeElemento", data.ubicacionDeElemento);
  
      if (data.imgElemento && data.imgElemento.length > 0) {
        formDataToSend.append("imgElemento", data.imgElemento[0]);
      }
      if (data.documentacionElemento && data.documentacionElemento.length > 0) {
        formDataToSend.append("documentacionElemento", data.documentacionElemento[0]);
      }
  
      await createElemento(formDataToSend);
      closeModal(); // Cerrar modal tras el envío exitoso
    } catch (error) {
      console.error("Error creando elemento:", error);
    } finally {
      setIsLoading(false); // Desactivamos el spinner de carga
      reset(); // Resetear el formulario
    }
  };

  const handleReset = () => {
    reset();
    setFormData({
      nombreElemento: "",
      codigoElemento: "",
      marcaElemento: "",
      tipoElemento: "",
      ubicacionDeElemento: "",
      imgElemento: null,
      documentacionElemento: null,
    });
  };

  return (
    <>
      {isLoading && ( // Spinner de carga
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
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombreElemento" className="text-black font-bold block mb-1">
            Nombre del Elemento:
          </label>
          <input
            type="text"
            name="nombreElemento"
            {...register("nombreElemento", { required: "El nombre del elemento es obligatorio" })}
            placeholder="Nombre del Elemento"
            onChange={(e) => handleInputChange(e)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.nombreElemento && (
            <p className="text-red-500">{errors.nombreElemento.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="codigoElemento" className="text-black font-bold block mb-1">
            Código del Elemento:
          </label>
          <input
            type="text"
            name="codigoElemento"
            {...register("codigoElemento", { required: "El código del elemento es obligatorio" })}
            placeholder="Código del Elemento"
            onChange={(e) => handleInputChange(e)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.codigoElemento && (
            <p className="text-red-500">{errors.codigoElemento.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="marcaElemento" className="text-black font-bold block mb-1">
            Marca del Elemento:
          </label>
          <input
            type="text"
            name="marcaElemento"
            {...register("marcaElemento", { required: "La marca del elemento es obligatoria" })}
            placeholder="Marca del Elemento"
            onChange={(e) => handleInputChange(e)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.marcaElemento && (
            <p className="text-red-500">{errors.marcaElemento.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="tipoElemento" className="text-black font-bold block mb-1">
            Tipo del Elemento:
          </label>
          <input
            type="text"
            name="tipoElemento"
            {...register("tipoElemento", { required: "El tipo del elemento es obligatorio" })}
            placeholder="Tipo del Elemento"
            onChange={(e) => handleInputChange(e)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.tipoElemento && (
            <p className="text-red-500">{errors.tipoElemento.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="ubicacionDeElemento" className="text-black font-bold block mb-1">
            Ubicación del Elemento:
          </label>
          <select
            name="ubicacionDeElemento"
            {...register("ubicacionDeElemento", { required: "La ubicación del elemento es obligatoria" })}
            onChange={(e) => handleInputChange(e)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          >
            <option value="">Selecciona una ubicación</option>
            {casinos.map((casino) => (
              <option key={casino._id} value={casino._id}>
                {casino.nombreCasino}
              </option>
            ))}
          </select>
          {errors.ubicacionDeElemento && (
            <p className="text-red-500">{errors.ubicacionDeElemento.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="imgElemento" className="text-black font-bold block mb-1">
            Imagen del Elemento (Opcional):
          </label>
          <input
            type="file"
            name="imgElemento"
            {...register("imgElemento")}
            onChange={(e) => handleInputChange(e, true)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
        </div>
        <div>
          <label htmlFor="documentacionElemento" className="text-black font-bold block mb-1">
            Documentación del Elemento (Opcional):
          </label>
          <input
            type="file"
            name="documentacionElemento"
            {...register("documentacionElemento")}
            onChange={(e) => handleInputChange(e, true)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={isLoading} // Botón desactivado durante la carga
          >
            Guardar Elemento
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 text-white py-2 px-4 ml-4 rounded-md hover:bg-gray-600"
          >
            Resetear Formulario
          </button>
        </div>
      </form>
    </>
  );
}

export default FormElemento;