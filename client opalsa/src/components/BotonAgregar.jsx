import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AgregarIcon from "../assets/agregar_icon.svg";
import { useMaquinas } from "../context/MaquinasContext";
import { useCasinos } from "../context/CasinosContext";
import { getCasinosRequest } from "../api/casinos";

function BotonAgregar() {
  const { register, handleSubmit, reset } = useForm();
  const { createMaquina } = useMaquinas();
  const { createCasino } = useCasinos();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("maquina");
  const [casinos, setCasinos] = useState([]);
  const [formData, setFormData] = useState({
    maquina: {
      imgMaquina: null,
      nroSerieMaquina: "",
      modeloMaquina: "",
      marcaMaquina: "",
      softwareMaquina: "",
      juegoMaquina: "",
      estadoMaquina: "activo", // Valor por defecto
      descripcionMaquina: "",
      ubicacionMaquina: "", // Asegúrate de manejar la ubicación correctamente
      fechaInstalacionMaquina: "",
      proveedorMaquina: "",
      documentoMaquina: null,
    },
    casino: {
      nombreCasino: "",
      imgCasino: null,
      ciudadCasino: "",
      direccionCasino: "",
      documentacionCasino: null,
    },
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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    reset();
    setFormData({
      maquina: {
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
      },
      casino: {
        nombreCasino: "",
        imgCasino: null,
        ciudadCasino: "",
        direccionCasino: "",
        documentacionCasino: null,
      },
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const section = getSelectedSection();
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [event.target.name]: file,
      },
    });
  };

  const onSubmitMaquina = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData.maquina).forEach((key) => {
        formDataToSend.append(key, formData.maquina[key]);
      });
      await createMaquina(formDataToSend);
      closeModal();
    } catch (error) {
      console.error("Error creating machine:", error);
    }
  };

  const onSubmitCasino = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData.casino).forEach((key) => {
        formDataToSend.append(key, formData.casino[key]);
      });
      await createCasino(formDataToSend);
      closeModal();
    } catch (error) {
      console.error("Error creating casino:", error);
    }
  };

  const handleInputChange = (event, isFile = false) => {
    const { name, value } = event.target;
    const section = getSelectedSection();
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: isFile ? event.target.files[0] : value,
      },
    });
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const getSelectedSection = () => {
    return selectedOption;
  };

  return (
    <div className="bg-gray-100 mb-3 pl-12">
      <div className="max-w-xl mx-auto flex items-center justify-center">
        <div className="flex items-center">
          <img
            src={AgregarIcon}
            alt="Guardar"
            className="h-8 w-8 cursor-pointer transition-transform transform hover:scale-110 ml-4"
            onClick={openModal}
          />
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="relative bg-white p-4 rounded-md w-120 max-w-4xl max-h-[80vh] overflow-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              &#x2715; {/* HTML entity for "X" */}
            </button>
            <h2 className="text-lg text-center font-semibold mb-4">
              Agrega un nuevo elemento.
            </h2>
            <div className="flex flex-col">
              <label className="mb-2">Selecciona una opción:</label>
              <div>
                <input
                  type="radio"
                  id="casino"
                  name="option"
                  value="casino"
                  checked={selectedOption === "casino"}
                  onChange={() => handleOptionChange("casino")}
                />
                <label htmlFor="casino" className="text-black ml-2 mr-4">
                  Casino
                </label>

                <input
                  type="radio"
                  id="maquina"
                  name="option"
                  value="maquina"
                  checked={selectedOption === "maquina"}
                  onChange={() => handleOptionChange("maquina")}
                />
                <label htmlFor="maquina" className="text-black ml-2">
                  Máquina
                </label>
              </div>
            </div>

            {selectedOption === "maquina" && (
              <form
                onSubmit={handleSubmit(onSubmitMaquina)}
                className="grid grid-cols-2 gap-6"
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
                    value={formData.maquina.nroSerieMaquina}
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
                    value={formData.maquina.modeloMaquina}
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
                    value={formData.maquina.marcaMaquina}
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
                    value={formData.maquina.softwareMaquina}
                    {...register("softwareMaquina")}
                    placeholder="Software de la Máquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                  />
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
                    value={formData.maquina.juegoMaquina}
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
                    value={formData.maquina.estadoMaquina}
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
                    value={formData.maquina.descripcionMaquina}
                    {...register("descripcionMaquina")}
                    placeholder="Descripción de la Máquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="ubicacionMaquina"
                    className="text-black font-bold block mb-1"
                  >
                    Ubicación de la Máquina:
                  </label>
                  <select
                    name="ubicacionMaquina"
                    value={formData.maquina.ubicacionMaquina}
                    {...register("ubicacionMaquina", { required: true })}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                  >
                    <option value="">Seleccione una ubicación</option>
                    {casinos.map((casino) => (
                      <option key={casino._id} value={casino.nombreCasino}>
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
                    Fecha de Instalación de la Máquina:
                  </label>
                  <input
                    type="date"
                    name="fechaInstalacionMaquina"
                    value={formData.maquina.fechaInstalacionMaquina}
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
                    value={formData.maquina.proveedorMaquina}
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
                    Documentación de la Máquina:
                  </label>
                  <input
                    type="file"
                    name="documentoMaquina"
                    onChange={(e) => handleFileChange(e)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}
            {selectedOption === "casino" && (
              <form
                onSubmit={handleSubmit(onSubmitCasino)}
                className="grid grid-cols-2 gap-6"
              >
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
                    onChange={(e) => handleInputChange(e, true)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                  />
                </div>
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
                    value={formData.casino.nombreCasino}
                    {...register("nombreCasino")}
                    placeholder="Nombre del Casino"
                    onChange={handleInputChange}
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
                    value={formData.casino.ciudadCasino}
                    {...register("ciudadCasino")}
                    placeholder="Ciudad del Casino"
                    onChange={handleInputChange}
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
                    value={formData.casino.direccionCasino}
                    {...register("direccionCasino")}
                    placeholder="Dirección del Casino"
                    onChange={handleInputChange}
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
                    onChange={(e) => handleFileChange(e)}
                    className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mt-4"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BotonAgregar;
