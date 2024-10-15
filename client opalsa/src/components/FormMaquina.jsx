import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMaquinas } from "../context/MaquinasContext";
import { getCasinosRequest } from "../api/casinos";
import Select from "react-select";

function FormMaquina({ onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(); // Usamos `errors` para la validación
  const { createMaquina } = useMaquinas();
  const [casinos, setCasinos] = useState([]);
  const [ubicacionError, setUbicacionError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Spinner de carga
  const [isSuccess, setIsSuccess] = useState(false); // Estado para el éxito
  const [error, setError] = useState(null); // Estado para el error
  const [formData, setFormData] = useState({
    imgMaquina: null,
    nroSerieMaquina: "",
    modeloMaquina: "",
    marcaMaquina: "",
    precioMaquina: "",
    juegoMaquina: "",
    estadoMaquina: "activo",
    ubicacionMaquina: "",
    fechaInstalacionMaquina: "",
    proveedorMaquina: "",
    documentoMaquina: null,
  });

  // Fetching casinos
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
    const { name, value } = event.target;
    if (name === "precioMaquina") {
      const numericValue = value.replace(/\D/g, ""); // Eliminar cualquier caracter no numérico
      if (numericValue.length <= 11) { // Limitar a 11 dígitos
        setFormData({
          ...formData,
          [name]: formatPrice(numericValue),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: isFile ? event.target.files[0] : value,
      });
    }
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      ubicacionMaquina: selectedOption ? selectedOption.value : "", // Mantener vacío si no hay selección
    });
  };

  const onSubmit = async () => {
    setIsLoading(true); // Activamos el spinner
    setIsSuccess(false); // Reseteamos el estado de éxito
    setError(null); // Reseteamos el estado de error
    setUbicacionError(null); // Reseteamos el mensaje de error de ubicación
  
    // Verificar si se ha seleccionado una ubicación
    if (!formData.ubicacionMaquina) {
      setUbicacionError("Por favor, seleccione una ubicación.");
      setIsLoading(false); // Desactivamos el spinner
      return; // Detener el envío del formulario
    }
  
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
  
      // Intentamos crear la máquina
      await createMaquina(formDataToSend);
  
      // Si la creación fue exitosa
      setIsSuccess(true); // Mostramos mensaje de éxito
      setError(null); // Aseguramos que no hay error
  
      // Resetear el formulario al estado inicial
      reset();  // Resetear el formulario usando react-hook-form
      setFormData({
        imgMaquina: null,
        nroSerieMaquina: "",
        modeloMaquina: "",
        marcaMaquina: "",
        precioMaquina: "",
        juegoMaquina: "",
        estadoMaquina: "activo",
        ubicacionMaquina: "", // Restablecer el valor de ubicacionMaquina
        fechaInstalacionMaquina: "",
        proveedorMaquina: "",
        documentoMaquina: null,
      });
  
      // Hacer que el mensaje de éxito desaparezca después de 5 segundos
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
  
    } catch (error) {
      setError("Error al crear la máquina. Por favor, intente nuevamente.");
      setIsSuccess(false); // Nos aseguramos de que no haya éxito
      console.error("Error creando máquina:", error);
    } finally {
      setIsLoading(false); // Desactivamos el spinner
    }
  };
  


  // Formateo de precio en COP
  const formatPrice = (value) => {
    const numberFormat = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return numberFormat.format(value);
  };

  const casinoOptions = casinos.map((casino) => ({
    value: casino.nombreCasino,
    label: casino.nombreCasino,
  }));


  

  return (
    <>
      {/* Loader Spinner */}
      {isLoading && (
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

      {/* Mensaje de éxito */}
      {isSuccess && (
        <div className="text-green-500 font-bold">
          Máquina creada exitosamente.
        </div>
      )}

      {/* Mensaje de error */}
      {error && <div className="text-red-500 font-bold">{error}</div>}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6 relative"
      >
        <div>
          <label
            htmlFor="imgMaquina"
            className="text-black font-bold block mb-1"
          >
            Imagen de la Máquina:
          </label>
          <input
            type="file"
            name="imgMaquina"
            {...register("imgMaquina", {
              required: "Este campo es obligatorio",
            })}
            onChange={(e) => handleInputChange(e, true)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.imgMaquina && (
            <p className="text-red-500">{errors.imgMaquina.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="nroSerieMaquina"
            className="text-black font-bold block mb-1"
          >
            Número de Serie:
          </label>
          <input
            type="text"
            name="nroSerieMaquina"
            {...register("nroSerieMaquina", {
              required: "Este campo es obligatorio",
            })}
            value={formData.nroSerieMaquina}
            placeholder="Número de Serie"
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.nroSerieMaquina && (
            <p className="text-red-500">{errors.nroSerieMaquina.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="modeloMaquina"
            className="text-black font-bold block mb-1"
          >
            Modelo de la Máquina:
          </label>
          <input
            type="text"
            name="modeloMaquina"
            {...register("modeloMaquina", {
              required: "Este campo es obligatorio",
            })}
            value={formData.modeloMaquina}
            placeholder="Modelo de la Máquina"
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.modeloMaquina && (
            <p className="text-red-500">{errors.modeloMaquina.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="marcaMaquina"
            className="text-black font-bold block mb-1"
          >
            Marca de la Máquina:
          </label>
          <input
            type="text"
            name="marcaMaquina"
            {...register("marcaMaquina", {
              required: "Este campo es obligatorio",
            })}
            value={formData.marcaMaquina}
            placeholder="Marca de la Máquina"
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.marcaMaquina && (
            <p className="text-red-500">{errors.marcaMaquina.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="precioMaquina" className="text-black font-bold block mb-1">
            Precio de la Máquina (COP):
          </label>
          <input
            type="text"
            name="precioMaquina"
            value={formData.precioMaquina}
            {...register("precioMaquina", {
              required: "Este campo es obligatorio",
              maxLength: {
                value: 16,
                message: "El precio no puede tener más de 11 dígitos.",
              },
            })}
            placeholder="Precio de la Máquina"
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.precioMaquina && <p className="text-red-500">{errors.precioMaquina.message}</p>}
        </div>
        <div>
          <label
            htmlFor="juegoMaquina"
            className="text-black font-bold block mb-1"
          >
            Juego de la Máquina:
          </label>
          <input
            type="text"
            name="juegoMaquina"
            {...register("juegoMaquina", {
              required: "Este campo es obligatorio",
            })}
            value={formData.juegoMaquina}
            placeholder="Juego de la Máquina"
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.juegoMaquina && (
            <p className="text-red-500">{errors.juegoMaquina.message}</p>
          )}
        </div>
        <div className="mt-4">
          <label htmlFor="ubicacionMaquina" className="text-black font-bold block mb-1">
            Ubicación de la Máquina:
          </label>
          <Select
            value={casinoOptions.find(
              (option) => option.value === formData.ubicacionMaquina
            )}
            onChange={handleSelectChange}
            options={casinoOptions}
            className="w-full text-gray-900 rounded-lg focus:outline-none"
            placeholder="Selecciona una ubicación"
          />
          {ubicacionError && (
            <p className="text-red-500">{ubicacionError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="fechaInstalacionMaquina"
            className="text-black font-bold block mb-1"
          >
            Fecha de Instalación:
          </label>
          <input
            type="date"
            name="fechaInstalacionMaquina"
            {...register("fechaInstalacionMaquina", {
              required: "Este campo es obligatorio",
            })}
            value={formData.fechaInstalacionMaquina}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.fechaInstalacionMaquina && (
            <p className="text-red-500">
              {errors.fechaInstalacionMaquina.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="proveedorMaquina"
            className="text-black font-bold block mb-1"
          >
            Proveedor de la Máquina:
          </label>
          <input
            type="text"
            name="proveedorMaquina"
            {...register("proveedorMaquina", {
              required: "Este campo es obligatorio",
            })}
            value={formData.proveedorMaquina}
            placeholder="Proveedor de la Máquina"
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.proveedorMaquina && (
            <p className="text-red-500">{errors.proveedorMaquina.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="documentoMaquina"
            className="text-black font-bold block mb-1"
          >
            Documento de la Máquina:
          </label>
          <input
            type="file"
            name="documentoMaquina"
            {...register("documentoMaquina", {
            })}
            onChange={(e) => handleInputChange(e, true)}
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.documentoMaquina && (
            <p className="text-red-500">{errors.documentoMaquina.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={isLoading} // Deshabilitar el botón mientras se está cargando
          >
            Guardar Máquina
          </button>
        </div>
      </form>
    </>
  );
}

export default FormMaquina;
