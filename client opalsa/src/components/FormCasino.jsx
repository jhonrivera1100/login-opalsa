import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCasinos } from "../context/CasinosContext";

function FormCasino({ onClose }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { createCasino } = useCasinos();
  const [isSuccess, setIsSuccess] = useState(false); // Nuevo estado para mostrar el mensaje de éxito

  const [formData, setFormData] = useState({
    nombreCasino: "",
    ciudadCasino: "",
    direccionCasino: "",
    imgCasino: null,
    documents: [],
  });

  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para el loader

  const addDocumentField = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { file: null, category: "" }],
    });
  };

  const handleDocumentChange = (index, event) => {
    const { name, value, files } = event.target;
    const updatedDocuments = [...formData.documents];

    if (name === "file") {
      updatedDocuments[index].file = files[0];
    } else {
      updatedDocuments[index].category = value;
    }

    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  const removeDocumentField = (index) => {
    const updatedDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  const onSubmit = async () => {
    setIsLoading(true); // Activamos el loader
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombreCasino", formData.nombreCasino);
      formDataToSend.append("ciudadCasino", formData.ciudadCasino);
      formDataToSend.append("direccionCasino", formData.direccionCasino);

      if (formData.imgCasino) {
        formDataToSend.append("imgCasino", formData.imgCasino[0]);
      }

      formData.documents.forEach((doc, index) => {
        if (doc.file && doc.category) {
          formDataToSend.append(`documents[${index}][file]`, doc.file);
          formDataToSend.append(`documents[${index}][category]`, doc.category);
        }
      });

      await createCasino(formDataToSend);
      setIsSuccess(true);
      window.location.reload();
    } catch (error) {
      console.error("Error creating casino:", error);
    } finally {
      setIsLoading(false); // Desactivamos el loader
    }
  };

  const handleReset = () => {
    reset();
    setFormData({
      nombreCasino: "",
      ciudadCasino: "",
      direccionCasino: "",
      imgCasino: null,
      documents: [],
    });
  };

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

      {isSuccess && (
        <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <svg className="fill-current w-6 h-6 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 15l-5.5-5.5L6 8l4 4 8-8 1.5 1.5L10 15z"/>
          </svg>
          <span className="block sm:inline font-semibold">¡Casino creado exitosamente!</span>
        </div>
      )}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6 relative"
      >
        <div>
          <label
            htmlFor="nombreCasino"
            className="text-black font-bold block mb-1"
          >
            Nombre del Casino:
          </label>
          <input
            type="text"
            name="nombreCasino"
            value={formData.nombreCasino}
            {...register("nombreCasino", { required: "El nombre del casino es obligatorio" })}
            placeholder="Nombre del Casino"
            onChange={(e) =>
              setFormData({ ...formData, nombreCasino: e.target.value })
            }
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.nombreCasino && (
            <p className="text-red-500">{errors.nombreCasino.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="ciudadCasino"
            className="text-black font-bold block mb-1"
          >
            Ciudad del Casino:
          </label>
          <input
            type="text"
            name="ciudadCasino"
            value={formData.ciudadCasino}
            {...register("ciudadCasino", { required: "La ciudad del casino es obligatoria" })}
            placeholder="Ciudad del Casino"
            onChange={(e) =>
              setFormData({ ...formData, ciudadCasino: e.target.value })
            }
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.ciudadCasino && (
            <p className="text-red-500">{errors.ciudadCasino.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="direccionCasino"
            className="text-black font-bold block mb-1"
          >
            Dirección del Casino:
          </label>
          <input
            type="text"
            name="direccionCasino"
            value={formData.direccionCasino}
            {...register("direccionCasino", { required: "La dirección del casino es obligatoria" })}
            placeholder="Dirección del Casino"
            onChange={(e) =>
              setFormData({ ...formData, direccionCasino: e.target.value })
            }
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.direccionCasino && (
            <p className="text-red-500">{errors.direccionCasino.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="imgCasino"
            className="text-black font-bold block mb-1"
          >
            Imagen del Casino:
          </label>
          <input
            type="file"
            name="imgCasino"
            {...register("imgCasino", { required: "La imagen del casino es obligatoria" })}
            onChange={(e) =>
              setFormData({ ...formData, imgCasino: e.target.files })
            }
            className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
          />
          {errors.imgCasino && (
            <p className="text-red-500">{errors.imgCasino.message}</p>
          )}
        </div>

        {/* Campos dinámicos de archivos con categorías */}
        <div className="col-span-2">
          <label className="text-black font-bold block mb-1">
            Subir Documentos:
          </label>
          {formData.documents.map((doc, index) => (
            <div key={index} className="flex gap-4 items-center mb-4">
              <select
                name="category"
                value={doc.category}
                onChange={(e) => handleDocumentChange(index, e)}
                className="border border-gray-300 rounded-md py-2 px-4 w-1/3 text-black"
              >
                <option value="">Seleccione una categoría</option>
                <option value="documentacionLegal">Documentación Legal</option>
                <option value="usoDeSuelos">Uso de Suelos</option>
                <option value="colJuegos">ColJuegos</option>
                <option value="otrosDocumentos">Otros Documentos</option>
              </select>
              <input
                type="file"
                name="file"
                onChange={(e) => handleDocumentChange(index, e)}
                className="border border-gray-300 rounded-md py-2 px-4 w-1/3 text-black"
              />
              <button
                type="button"
                onClick={() => removeDocumentField(index)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDocumentField}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Añadir Documento
          </button>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={isLoading} // Deshabilitamos el botón mientras se está cargando
          >
            Guardar Casino
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

export default FormCasino;
