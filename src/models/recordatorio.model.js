import mongoose from "mongoose";

const recordatorioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  fechaRecordatorio: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model('Recordatorio', recordatorioSchema);