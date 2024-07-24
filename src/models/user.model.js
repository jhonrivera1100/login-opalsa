import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  cedula: {
    type: Number,
    required: true,
    unique: true
  },
  cargo: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],  // Puedes añadir más roles según tus necesidades
    default: 'user'
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
