import mongoose from "mongoose";

const maquinaSchema = mongoose.Schema({
    nroSerieMaquina:{
        type: String,
        required: true,
        trim: true
    },
    nombreMaquina: {
        type: String,
        required: true,
        trim: true
    },
    modeloMaquina: {
        type: String,
        required: true,
        trim: true
    },
    marcaMaquina: {
        type: String,
        required: true,
        trim: true
    },
    softwareMaquina: {
        type: String,
        required: true,
        trim: true
    },
    juegoMaquina: {
        type: String,
        required: true,
        trim: true
    },
    estadoMaquina: {
        type: String,
        required: true,
        trim: true
    },
    imgMaquina: {
        type: String,
        required: true,
        trim: true
    },
    descripcionMaquina: {
        type: String,
        required: true,
        trim: true
    },
    ubicacionMaquina: {
        type: String,
        required: true,
        trim: true
    },
    fechaInstalacionMaquina: {
        type: String,
        required: true,
        trim: true
    },
    proveedorMaquina: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps:true
})

export default mongoose.model('Maquinas', maquinaSchema)