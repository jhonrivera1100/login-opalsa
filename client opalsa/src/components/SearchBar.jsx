import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AgregarIcon from "../assets/agregar_icon.svg";
import { useMaquinas } from "../context/MaquinasContext";
import { getCasinosRequest } from "../api/casinos";

function SearchBar() {
  const { register, handleSubmit } = useForm();
  const { createMaquina } = useMaquinas();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("maquina");
  const [casinos, setCasinos] = useState([]);
  const [formData, setFormData] = useState({
    maquina: {
      imgMaquina: null,
      nroSerieMaquina: "",
      nombreMaquina: "",
      modeloMaquina: "",
      marcaMaquina: "",
      softwareMaquina: "",
      juegoMaquina: "",
      estadoMaquina: "",
      descripcionMaquina: "",
      ubicacionMaquina: "",
      fechaInstalacionMaquina: "",
      proveedorMaquina: "",
    },
    empresa: {
      nombreEmpresa: "",
      ciudadEmpresa: "",
      direccionEmpresa: "",
      imgEmpresa: "",
    },
    casino: {
      nombreCasino: "",
      ciudadCasino: "",
      direccionCasino: "",
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

  const onSubmit = handleSubmit(() => {
    const formDataToSend = new FormData();
    Object.keys(formData.maquina).forEach(key => {
      formDataToSend.append(key, formData.maquina[key]);
    });
    createMaquina(formDataToSend);
  });

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
    if (selectedOption === "empresa") {
      return "empresa";
    } else if (selectedOption === "casino") {
      return "casino";
    } else {
      return "maquina";
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-xl mx-auto flex items-center justify-center">
        <div className="flex items-center">
          <img
            src={AgregarIcon}
            alt="Guardar"
            className="h-8 w-8 cursor-pointer transition-transform transform hover:scale-110 ml-4"
            onClick={openModal}
          />
          <h2 className="font-semibold p-6">Agregar</h2>
        </div>
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-md max-h-screen overflow-auto w-120">
            <h2 className="text-lg font-semibold mb-4">Modal de Agregar</h2>
            <div className="flex flex-col">
              <label className="mb-2">Selecciona una opción:</label>
              <div>
                <input
                  type="radio"
                  id="empresa"
                  name="option"
                  value="empresa"
                  checked={selectedOption === "empresa"}
                  onChange={() => handleOptionChange("empresa")}
                />
                <label htmlFor="empresa" className="text-black ml-2 mr-4">
                  Empresa
                </label>

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
              <div>
                <form onSubmit={onSubmit} className="grid grid-cols-2 gap-6">
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
                      onChange={(e) => handleInputChange(e, true)} // true indica que es un cambio de archivo
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
                      autoFocus
                      placeholder="Número de Serie"
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nombreMaquina"
                      className="text-black font-bold block mb-1"
                    >
                      Nombre de la Máquina:
                    </label>
                    <input
                      type="text"
                      name="nombreMaquina"
                      value={formData.maquina.nombreMaquina}
                      {...register("nombreMaquina")}
                      autoFocus
                      placeholder="Nombre de la Máquina"
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
                      autoFocus
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
                      autoFocus
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
                      autoFocus
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
                      autoFocus
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
                    <input
                      type="text"
                      name="estadoMaquina"
                      value={formData.maquina.estadoMaquina}
                      {...register("estadoMaquina")}
                      autoFocus
                      placeholder="Estado de la Máquina"
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="descripcionMaquina"
                      className="text-black font-bold block mb-1"
                    >
                      Descripción de la Máquina:
                    </label>
                    <input
                      type="text"
                      name="descripcionMaquina"
                      value={formData.maquina.descripcionMaquina}
                      {...register("descripcionMaquina")}
                      autoFocus
                      placeholder="Descripción de la Máquina"
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                    />
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
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                    >
                      <option value="">Seleccionar Casino</option>
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
                      Fecha de Instalación:
                    </label>
                    <input
                      type="date"
                      name="fechaInstalacionMaquina"
                      value={formData.maquina.fechaInstalacionMaquina}
                      {...register("fechaInstalacionMaquina")}
                      autoFocus
                      placeholder="Fecha de Instalación"
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="proveedorMaquina"
                      className="text-black font-bold block mb-1"
                    >
                      Proveedor:
                    </label>
                    <input
                      type="text"
                      name="proveedorMaquina"
                      value={formData.maquina.proveedorMaquina}
                      {...register("proveedorMaquina")}
                      autoFocus
                      placeholder="Proveedor"
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md py-2 px-4 w-full text-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="col-span-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Guardar
                  </button>
                </form>
              </div>
            )}

            {selectedOption === "empresa" && (
              <div>
                <input
                  type="text"
                  name="nombreEmpresa"
                  value={formData.empresa.nombreEmpresa}
                  placeholder="Nombre de la Empresa"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />
                <input
                  type="text"
                  name="ciudadEmpresa"
                  value={formData.empresa.ciudadEmpresa}
                  placeholder="Ciudad de la Empresa"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />
                <input
                  type="text"
                  name="direccionEmpresa"
                  value={formData.empresa.direccionEmpresa}
                  placeholder="Dirección de la Empresa"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />
              </div>
            )}

            {selectedOption === "casino" && (
              <div>
                <input
                  type="text"
                  name="nombreCasino"
                  value={formData.casino.nombreCasino}
                  placeholder="Nombre del Casino"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />
                <input
                  type="text"
                  name="ciudadCasino"
                  value={formData.casino.ciudadCasino}
                  placeholder="Ciudad del Casino"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />
                <input
                  type="text"
                  name="direccionCasino"
                  value={formData.casino.direccionCasino}
                  placeholder="Dirección del Casino"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />
              </div>
            )}

            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
