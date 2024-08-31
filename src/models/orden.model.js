import mongoose from 'mongoose';

const OrdenSchema = new mongoose.Schema({
  fechaOrden: { type: Date, required: true },
  descripcionOrden: { type: String, required: true },
  nroSerieMaquina: { type: String, required: true },
  ubicacionMaquina: { type: String, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  componentes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Componente' }],
});
export default mongoose.model('Orden', OrdenSchema);
