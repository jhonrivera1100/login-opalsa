import mongoose from 'mongoose';

const mantenimientoSchema = new mongoose.Schema({
  tipoMantenimiento: { type: String, required: true },
  fechaMantenimiento: { type: Date, default: Date.now, required: true },
  descripcion: { type: String, required: true },
  archivo: { type: String},
  nroSerieMaquina: { type: String, required: true }, // Agregado
  nombreMaquina: { type: String, required: true }, // Agregado
  ubicacionMaquina: { type: String, required: true }, // Agregado

});

export default mongoose.model('Mantenimiento', mantenimientoSchema);