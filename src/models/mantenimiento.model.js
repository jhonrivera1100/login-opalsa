import mongoose from 'mongoose';

const mantenimientoSchema = new mongoose.Schema({
  tipoMantenimiento: { type: String, required: true },
  fechaMantenimiento: { type: Date, default: Date.now, required: true },
  descripcion: { type: String, required: true },
  archivo: {
    url: { type: String },
    public_id: { type: String },
  },
  maquina: { type: mongoose.Schema.Types.ObjectId, ref: 'Maquinas' },
  nroSerieMaquina: { type: String, required: true },
  marcaMaquina: { type: String, required: true },
  ubicacionMaquina: { type: String, required: true },
});

export default mongoose.model('Mantenimiento', mantenimientoSchema);
