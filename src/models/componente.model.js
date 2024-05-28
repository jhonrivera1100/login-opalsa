import mongoose from "mongoose";

// Definir el esquema para los componentes
const componenteSchema = mongoose.Schema({
    serialComponente: {
        type: String,
        required: true,
        trim: true
    },
    nombreComponente: {
        type: String,
        required: true,
        trim: true
    },
    marcaComponente: {
        type: String,
        required: false,
        trim: true
    },
    documentoComponente: {
        type: String,
        required: true,
        trim: true
    },
    maquina: {
        type: mongoose.Schema.Types.ObjectId, // Esto establece la relación con la máquina
        ref: 'Maquina' // Referencia al modelo de datos de las máquinas
    }
});

export default mongoose.model('Componente', componenteSchema);