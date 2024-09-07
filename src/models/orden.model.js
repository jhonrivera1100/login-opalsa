import mongoose from 'mongoose';

const OrdenSchema = new mongoose.Schema({
  fechaOrden: { type: Date, required: true }, // Establece la fecha y hora actual por defecto
  estadoOrden: { type: String, required: true, default: 'Orden en solicitud' },
  descripcionOrden: { type: String, required: true },
  maquina: { type: mongoose.Schema.Types.ObjectId, ref: 'Maquinas', required: true }, // Referencia al modelo Maquinas
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tareaRealizada: { type: String },
  numeroOrden: { type: String, unique: true, required: true },
  componentesAsignados: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Componente' } // Referencia al modelo Componente
  ],
  componenteSobrantes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Componente' } // Referencia al modelo Componente
  ],
  sobrantes: { type: String },
  elementoOrden: [
    {
      nombre: { type: String, required: true },
      cantidad: { type: Number, required: true },
    }
  ],
  elementoOrdenSobrantes: [
    {
      nombre: { type: String, required: true },
      cantidadSobrante: { type: Number, required: true },
    }
  ],
  tipoDeMantenimiento: [
    { type: String, enum: ['preventivo', 'correctivo', 'predictivo', 'software', 'estético'] }
  ],
  fechaCumplimiento: { type: Date } // Nuevo campo para la fecha de cumplimiento
});

export default mongoose.model('Orden', OrdenSchema);
