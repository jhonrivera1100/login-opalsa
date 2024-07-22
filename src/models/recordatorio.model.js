import mongoose from 'mongoose';

const RecordatorioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaRecordatorio: {
    type: Date,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visto: { 
    type: Boolean,
    default: false
   } 
});

const Recordatorio = mongoose.model('Recordatorio', RecordatorioSchema);

export default Recordatorio;
