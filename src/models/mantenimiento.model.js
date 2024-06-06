import mongoose from 'mongoose';

const mantenimientoSchema = new mongoose.Schema({
  tipoMantenimiento: { type: String, required: true },
  fechaMantenimiento: { type: Date, default: Date.now, required: true },
  descripcion: { type: String, required: true },
  archivo: { type: String},

});

export default mongoose.model('Mantenimiento', mantenimientoSchema);