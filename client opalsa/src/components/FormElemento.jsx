import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useElementos } from "../context/ElementosContext";
import { getCasinosRequest } from "../api/casinos";

function FormElemento({ closeModal }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const { createElemento } = useElementos();
  const [casinos, setCasinos] = useState([]);
  const [formData, setFormData] = useState({
    nombreElemento: "",
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
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombreElemento", data.nombreElemento);
      formDataToSend.append("marcaElemento", data.marcaElemento);
      formDataToSend.append("tipoElemento", data.tipoElemento);
      formDataToSend.append("ubicacionDeElemento", data.ubicacionDeElemento);

      if (data.imgElemento[0]) {
        formDataToSend.append("imgElemento", data.imgElemento[0]);
      }
      if (data.documentacionElemento[0]) {
        formDataToSend.append("documentacionElemento", data.documentacionElemento[0]);
      }

      await createElemento(formDataToSend);
      reset(); // Reset the form fields after successful submission
      closeModal(); // Close the modal after submitting
    } catch (error) {
      console.error("Error creating element:", error);
    }
  };

  const handleReset = () => {
    reset();
    setFormData({
      nombreElemento: "",
      marcaElemento: "",
      tipoElemento: "",
      ubicacionDeElemento: "",
      imgElemento: null,
      documentacionElemento: null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
      <div>
        <label htmlFor="nombreElemento" className="text-black font-bold block mb-1">
          Nombre del Elemento:
        </label>
        <input
          type="text"
          name="nombreElemento"
          {...register("nombreElemento", { required: true })}
          placeholder="Nombre del Elemento"
          onChange={(e) => handleInputChange(e)}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="marcaElemento" className="text-black font-bold block mb-1">
          Marca del Elemento:
        </label>
        <input
          type="text"
          name="marcaElemento"
          {...register("marcaElemento", { required: true })}
          placeholder="Marca del Elemento"
          onChange={(e) => handleInputChange(e)}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="tipoElemento" className="text-black font-bold block mb-1">
          Tipo del Elemento:
        </label>
        <input
          type="text"
          name="tipoElemento"
          {...register("tipoElemento", { required: true })}
          placeholder="Tipo del Elemento"
          onChange={(e) => handleInputChange(e)}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="ubicacionDeElemento" className="text-black font-bold block mb-1">
          Ubicación del Elemento:
        </label>
        <select
          name="ubicacionDeElemento"
          {...register("ubicacionDeElemento", { required: true })}
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
      </div>
      <div>
        <label htmlFor="imgElemento" className="text-black font-bold block mb-1">
          Imagen del Elemento:
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
          Documentación del Elemento:
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
        >
          Guardar Elemento
        </button>
      </div>
    </form>
  );
}

export default FormElemento;
