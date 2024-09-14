import mongoose from 'mongoose';

const movimientosElementosSchema = new mongoose.Schema({
  elementoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Elemento', required: true },
  oldUbicacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Casinos', required: true }, // O la colección que corresponda
  oldUbicacionSerial: { type: String, required: true },
  newUbicacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Casinos', required: true }, // O la colección que corresponda
  newUbicacionSerial: { type: String, required: true },
  nombreElemento: { type: String, required: true },
  serialElemento: { type: String, required: true },
  fechaTransferencia: { type: Date, default: Date.now }
});

export default mongoose.model('MovimientosElementos', movimientosElementosSchema);
