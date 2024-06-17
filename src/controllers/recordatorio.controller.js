import Recordatorio from "../models/recordatorio.model.js";
import User from '../models/user.model.js'; 

export const createRecordatorio = async (req, res) => {
  try {
    const { titulo, descripcion, fechaRecordatorio, usuario } = req.body;

    // Validar los datos
    if (!titulo || !descripcion || !fechaRecordatorio || !usuario) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    // Buscar el ObjectId del usuario
    const usuarioObj = await User.findOne({ username: usuario });
    if (!usuarioObj) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const newRecordatorio = new Recordatorio({
      titulo,
      descripcion,
      fechaRecordatorio,
      usuario: usuarioObj._id // Asignar el ObjectId del usuario
    });

    await newRecordatorio.save();
    res.status(201).json(newRecordatorio);
  } catch (error) {
    console.error("Error al crear recordatorio:", error);
    res.status(500).json({ message: "Error al crear el recordatorio." });
  }
};


// Controlador para obtener todos los recordatorios
export const getRecordatorios = async (req, res) => {
  try {
    const recordatorios = await Recordatorio.find().populate('usuario', 'username');
    res.status(200).json(recordatorios);
  } catch (error) {
    console.error("Error al obtener recordatorios:", error);
    res.status(500).json({ message: "Error al obtener los recordatorios." });
  }
};


// Controlador para eliminar un recordatorio
export const deleteRecordatorio = async (req, res) => {
  try {
    const { id } = req.params;
    await Recordatorio.findByIdAndDelete(id);
    res.status(200).json({ message: "Recordatorio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el recordatorio:", error); // Log de error
    res.status(500).json({ message: "Error al eliminar el recordatorio" });
  }
};
