import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCasinos } from "../context/CasinosContext";

function FormCasino({ onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const { createCasino } = useCasinos();
  const [formData, setFormData] = useState({
    nombreCasino: "",
    ciudadCasino: "",
    direccionCasino: "",
    imgCasino: null,
    documentacionCasino: null,
  });

  const handleInputChange = (event, isFile = false) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: isFile ? event.target.files[0] : value,
    });
  };

  const onSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      await createCasino(formDataToSend);
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error("Error creating casino:", error);
    }
  };

  const handleReset = () => {
    reset();
    setFormData({
      nombreCasino: "",
      ciudadCasino: "",
      direccionCasino: "",
      imgCasino: null,
      documentacionCasino: null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
      <div>
        <label htmlFor="nombreCasino" className="text-black font-bold block mb-1">
          Nombre del Casino:
        </label>
        <input
          type="text"
          name="nombreCasino"
          value={formData.nombreCasino}
          {...register("nombreCasino")}
          placeholder="Nombre del Casino"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="ciudadCasino" className="text-black font-bold block mb-1">
          Ciudad del Casino:
        </label>
        <input
          type="text"
          name="ciudadCasino"
          value={formData.ciudadCasino}
          {...register("ciudadCasino")}
          placeholder="Ciudad del Casino"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="direccionCasino" className="text-black font-bold block mb-1">
          Dirección del Casino:
        </label>
        <input
          type="text"
          name="direccionCasino"
          value={formData.direccionCasino}
          {...register("direccionCasino")}
          placeholder="Dirección del Casino"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="imgCasino" className="text-black font-bold block mb-1">
          Imagen del Casino:
        </label>
        <input
          type="file"
          name="imgCasino"
          onChange={(e) => handleInputChange(e, true)}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label
          htmlFor="documentacionCasino"
          className="text-black font-bold block mb-1"
        >
          Documentación del Casino:
        </label>
        <input
          type="file"
          name="documentacionCasino"
          onChange={(e) => handleInputChange(e, true)}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Guardar Casino
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 ml-4"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-4"
        >
          Cerrar
        </button>
      </div>
    </form>
  );
}

export default FormCasino;
