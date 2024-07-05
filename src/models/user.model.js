// models/user.js
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
  }
}, {
  timestamps: true
});

export default mongoose.model('user', userSchema);
