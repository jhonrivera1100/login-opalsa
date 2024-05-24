import { useState } from "react";
import { useForm } from "react-hook-form";
import AgregarIcon from "../assets/agregar_icon.svg";
import { useMaquinas } from "../context/MaquinasContext";

function SearchBar() {
  const { register, handleSubmit } = useForm();
  const { createMaquina } = useMaquinas();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("maquina");
  const [formData, setFormData] = useState({
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
    maquina: {
      imgMaquina: "",
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
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const onSubmit = handleSubmit((data) => {
    createMaquina(data);
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const section = getSelectedSection();
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: value,
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
    <div className="mt-16">
      <div className="max-w-xl mx-auto flex items-center justify-center">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar..."
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-300 w-96"
          />
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
          <div className="bg-white p-4 rounded-md max-h-screen overflow-auto w-96">
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
                <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="imgMaquina"
                    value={formData.maquina.imgMaquina}
                    {...register("imgMaquina")}
                    autoFocus
                    placeholder="imagen maquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="nroSerieMaquina"
                    value={formData.maquina.nroSerieMaquina}
                    {...register("nroSerieMaquina")}
                    autoFocus
                    placeholder="Número de Serie"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="nombreMaquina"
                    value={formData.maquina.nombreMaquina}
                    {...register("nombreMaquina")}
                    autoFocus
                    placeholder="Nombre de la Máquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="modeloMaquina"
                    value={formData.maquina.modeloMaquina}
                    {...register("modeloMaquina")}
                    autoFocus
                    placeholder="Modelo de la Máquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="marcaMaquina"
                    value={formData.maquina.marcaMaquina}
                    {...register("marcaMaquina")}
                    autoFocus
                    placeholder="Marca de la Máquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="softwareMaquina"
                    value={formData.maquina.softwareMaquina}
                    {...register("softwareMaquina")}
                    autoFocus
                    placeholder="Software de la Maquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="juegoMaquina"
                    value={formData.maquina.juegoMaquina}
                    {...register("juegoMaquina")}
                    autoFocus
                    placeholder="Juego de la Maquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="estadoMaquina"
                    value={formData.maquina.estadoMaquina}
                    {...register("estadoMaquina")}
                    autoFocus
                    placeholder="Estado de la Maquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="descripcionMaquina"
                    value={formData.maquina.descripcionMaquina}
                    {...register("descripcionMaquina")}
                    autoFocus
                    placeholder="Descripcion de la Maquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="ubicacionMaquina"
                    value={formData.maquina.ubicacionMaquina}
                    {...register("ubicacionMaquina")}
                    autoFocus
                    placeholder="Ubicacion de la Maquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="fechaInstalacionMaquina"
                    value={formData.maquina.fechaInstalacionMaquina}
                    {...register("fechaInstalacionMaquina")}
                    autoFocus
                    placeholder="Fecha de instalacion"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <input
                    type="text"
                    name="proveedorMaquina"
                    value={formData.maquina.proveedorMaquina}
                    {...register("proveedorMaquina")}
                    autoFocus
                    placeholder="Proveedor de la Maquina"
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                  />
                  <button
                    type="submit" // Asegúrate de que sea un botón de tipo "submit" para enviar el formulario
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
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
                  placeholder="Direccion de la Empresa"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />

                <input
                  type="text"
                  name="imgEmpresa"
                  value={formData.empresa.imgEmpresa}
                  placeholder="Imagen de la Empresa"
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
                  placeholder="Direccion del Casino"
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md py-2 px-4 mt-2 mb-2 focus:outline-none focus:border-blue-300 w-full text-black"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
