import React, { useState } from "react";
import FormMaquina from "./FormMaquina";
import FormCasino from "./FormCasino";
import FormElemento from "./FormElemento"; // Importa el nuevo formulario

function ModalAgregar({ closeModal }) {
  const [selectedOption, setSelectedOption] = useState("maquina");

  const handleOptionChange = (option) => setSelectedOption(option);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-white p-4 rounded-md w-120 max-w-4xl max-h-[80vh] overflow-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          &#x2715;
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
            <label htmlFor="maquina" className="text-black ml-2 mr-4">
              Máquina
            </label>
            <input
              type="radio"
              id="elemento"
              name="option"
              value="elemento"
              checked={selectedOption === "elemento"}
              onChange={() => handleOptionChange("elemento")}
            />
            <label htmlFor="elemento" className="text-black ml-2">
              Elemento
            </label>
          </div>
        </div>

        {selectedOption === "maquina" && (
          <FormMaquina closeModal={closeModal} />
        )}
        {selectedOption === "casino" && <FormCasino closeModal={closeModal} />}
        {selectedOption === "elemento" && (
          <FormElemento closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}

export default ModalAgregar;
