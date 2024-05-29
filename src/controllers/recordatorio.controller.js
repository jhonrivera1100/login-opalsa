import Recordatorio from "../models/recordatorio.model.js";

// Controlador para crear un nuevo recordatorio
export const createRecordatorio = async (req, res) => {
  try {
    const { titulo, fechaRecordatorio } = req.body;
    const newRecordatorio = new Recordatorio({ titulo, fechaRecordatorio });
    await newRecordatorio.save();
    res.status(201).json(newRecordatorio);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el recordatorio" });
  }
};

// Controlador para obtener todos los recordatorios
export const getRecordatorios = async (req, res) => {
  try {
    const recordatorios = await Recordatorio.find();
    res.status(200).json(recordatorios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los recordatorios" });
  }
};

// Controlador para eliminar un recordatorio
export const deleteRecordatorio = async (req, res) => {
    try {
      const { id } = req.params;
      await Recordatorio.findByIdAndDelete(id);
      res.status(200).json({ message: "Recordatorio eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el recordatorio" });
    }
  };