import mongoose from "mongoose";

const componenteSchema = new mongoose.Schema({
  serialComponente: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  nombreComponente: {
    type: String,
    required: true,
    trim: true,
  },
  marcaComponente: {
    type: String,
    required: false,
    trim: true,
  },
  documentoComponente: {
    url: String,
    public_id: String,
  },
  usuarioEncargado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // No es obligatorio al crear el componente
  },
  maquina: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maquinas", // Asegúrate de que la referencia coincide con el nombre del modelo Maquinas
  },
});

export default mongoose.model("Componente", componenteSchema);
