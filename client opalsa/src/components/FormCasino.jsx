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
    documents: [], // Aquí guardamos los archivos y sus categorías
  });

  // Añadir un nuevo campo para documentos dinámicamente
  const addDocumentField = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { file: null, category: "" }], // Añadimos un nuevo objeto vacío para archivo y categoría
    });
  };

  // Maneja cambios en cada documento dinámico
  const handleDocumentChange = (index, event) => {
    const { name, value, files } = event.target;
    const updatedDocuments = [...formData.documents];

    if (name === "file") {
      updatedDocuments[index].file = files[0]; // Añade el archivo seleccionado
    } else {
      updatedDocuments[index].category = value; // Añade la categoría seleccionada
    }

    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  // Remover un campo de documento
  const removeDocumentField = (index) => {
    const updatedDocuments = formData.documents.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      documents: updatedDocuments,
    });
  };

  // Enviar el formulario
  const onSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      // Añadir campos de texto
      formDataToSend.append("nombreCasino", formData.nombreCasino);
      formDataToSend.append("ciudadCasino", formData.ciudadCasino);
      formDataToSend.append("direccionCasino", formData.direccionCasino);

      // Añadir la imagen del casino
      if (formData.imgCasino) {
        formDataToSend.append("imgCasino", formData.imgCasino[0]);
      }

      // Añadir los archivos con sus categorías específicas
      formData.documents.forEach((doc, index) => {
        if (doc.file && doc.category) {
          formDataToSend.append(`documents[${index}][file]`, doc.file);
          formDataToSend.append(`documents[${index}][category]`, doc.category);
        }
      });

      await createCasino(formDataToSend);
      window.location.reload(); // Recargar la página
    } catch (error) {
      console.error("Error creating casino:", error);
    }
  };

  // Resetear el formulario
  const handleReset = () => {
    reset();
    setFormData({
      nombreCasino: "",
      ciudadCasino: "",
      direccionCasino: "",
      imgCasino: null,
      documents: [], // Reiniciar los documentos dinámicos
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
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
          {...register("nombreCasino")}
          placeholder="Nombre del Casino"
          onChange={(e) =>
            setFormData({ ...formData, nombreCasino: e.target.value })
          }
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
          {...register("ciudadCasino")}
          placeholder="Ciudad del Casino"
          onChange={(e) =>
            setFormData({ ...formData, ciudadCasino: e.target.value })
          }
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
          {...register("direccionCasino")}
          placeholder="Dirección del Casino"
          onChange={(e) =>
            setFormData({ ...formData, direccionCasino: e.target.value })
          }
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
          onChange={(e) =>
            setFormData({ ...formData, imgCasino: e.target.files })
          }
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
  );
}

export default FormCasino;
