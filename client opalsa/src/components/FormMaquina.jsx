import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMaquinas } from "../context/MaquinasContext";
import { getCasinosRequest } from "../api/casinos";

function FormMaquina({ onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const { createMaquina } = useMaquinas();
  const [casinos, setCasinos] = useState([]);
  const [formData, setFormData] = useState({
    imgMaquina: null,
    nroSerieMaquina: "",
    modeloMaquina: "",
    marcaMaquina: "",
    softwareMaquina: "",
    juegoMaquina: "",
    estadoMaquina: "activo",
    descripcionMaquina: "",
    ubicacionMaquina: "",
    fechaInstalacionMaquina: "",
    proveedorMaquina: "",
    documentoMaquina: null,
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
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: isFile ? event.target.files[0] : value,
    });
  };

  const handleSelectChange = (event) => {
    const selectedCasinoId = event.target.value;
    const selectedCasino = casinos.find((casino) => casino._id === selectedCasinoId);
    setFormData({
      ...formData,
      ubicacionMaquina: selectedCasino ? selectedCasino.nombreCasino : "",
    });
  };

  const onSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      await createMaquina(formDataToSend);
      window.location.reload(); // Recarga la página
    } catch (error) {
      console.error("Error creating machine:", error);
    }
  };

  const handleReset = () => {
    reset();
    setFormData({
      imgMaquina: null,
      nroSerieMaquina: "",
      modeloMaquina: "",
      marcaMaquina: "",
      softwareMaquina: "",
      juegoMaquina: "",
      estadoMaquina: "activo",
      descripcionMaquina: "",
      ubicacionMaquina: "",
      fechaInstalacionMaquina: "",
      proveedorMaquina: "",
      documentoMaquina: null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
      <div>
        <label htmlFor="imgMaquina" className="text-black font-bold block mb-1">
          Imagen de la Máquina:
        </label>
        <input
          type="file"
          name="imgMaquina"
          onChange={(e) => handleInputChange(e, true)}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
          value={formData.nroSerieMaquina}
          {...register("nroSerieMaquina")}
          placeholder="Número de Serie"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
          value={formData.modeloMaquina}
          {...register("modeloMaquina")}
          placeholder="Modelo de la Máquina"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
          value={formData.marcaMaquina}
          {...register("marcaMaquina")}
          placeholder="Marca de la Máquina"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label
          htmlFor="softwareMaquina"
          className="text-black font-bold block mb-1"
        >
          Software de la Máquina:
        </label>
        <input
          type="text"
          name="softwareMaquina"
          value={formData.softwareMaquina}
          {...register("softwareMaquina")}
          placeholder="Software de la Máquina"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="juegoMaquina" className="text-black font-bold block mb-1">
          Juego de la Máquina:
        </label>
        <input
          type="text"
          name="juegoMaquina"
          value={formData.juegoMaquina}
          {...register("juegoMaquina")}
          placeholder="Juego de la Máquina"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label
          htmlFor="estadoMaquina"
          className="text-black font-bold block mb-1"
        >
          Estado de la Máquina:
        </label>
        <select
          name="estadoMaquina"
          value={formData.estadoMaquina}
          {...register("estadoMaquina")}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <div>
        <label
          htmlFor="descripcionMaquina"
          className="text-black font-bold block mb-1"
        >
          Descripción de la Máquina:
        </label>
        <textarea
          name="descripcionMaquina"
          value={formData.descripcionMaquina}
          {...register("descripcionMaquina")}
          placeholder="Descripción de la Máquina"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div>
        <label htmlFor="ubicacionMaquina" className="text-black font-bold block mb-1">
          Ubicación de la Máquina:
        </label>
        <select
          name="ubicacionMaquina"
          value={formData.ubicacionMaquina}
          onChange={handleSelectChange}
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
        <label
          htmlFor="fechaInstalacionMaquina"
          className="text-black font-bold block mb-1"
        >
          Fecha de Instalación:
        </label>
        <input
          type="date"
          name="fechaInstalacionMaquina"
          value={formData.fechaInstalacionMaquina}
          {...register("fechaInstalacionMaquina")}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
          value={formData.proveedorMaquina}
          {...register("proveedorMaquina")}
          placeholder="Proveedor de la Máquina"
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
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
          onChange={(e) => handleInputChange(e, true)}
          className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
        />
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Guardar Máquina
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

export default FormMaquina;
