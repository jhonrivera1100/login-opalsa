import Casino from '../models/casino.model.js';
import { uploadImage, deleteImage } from '../libs/cloudinary.js'; // Asumiendo que tienes estas funciones implementadas
import fs from 'fs-extra';

// Obtener todos los casinos
export const getAllCasinos = async (req, res) => {
    try {
      const casinos = await Casino.find().populate('maquinas');
      res.json(casinos);
    } catch (error) {
      res.status(500).json({
        message: "Error al recuperar los casinos",
        error: error.message,
      });
    }
  };
  
  // Obtener un casino por ID
  export const getCasinoById = async (req, res) => {
    try {
      const casino = await Casino.findById(req.params.id).populate('maquinas');
      if (!casino) return res.status(404).json({ message: "Casino no encontrado" });
      res.json(casino);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el casino", error: error.message });
    }
  };
  
  // Crear un nuevo casino
  export const createCasino = async (req, res) => {
    const {
      nombreCasino,
      ciudadCasino,
      direccionCasino,
      documentacionCasino,
      maquinas,
    } = req.body;
  
    let imgCasino = {};
  
    if (req.files && req.files.imgCasino) {
      const result = await uploadImage(req.files.imgCasino.tempFilePath);
      await fs.remove(req.files.imgCasino.tempFilePath);
      imgCasino = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
  
    const newCasino = new Casino({
      nombreCasino,
      imgCasino,
      ciudadCasino,
      direccionCasino,
      documentacionCasino,
      maquinas,
    });
  
    try {
      const casinoGuardado = await newCasino.save();
      res.json(casinoGuardado);
    } catch (error) {
      res.status(500).json({
        message: "Error al guardar el casino",
        error: error.message,
      });
    }
  };
  
  // Actualizar un casino existente
  export const updateCasino = async (req, res) => {
    const {
      nombreCasino,
      ciudadCasino,
      direccionCasino,
      documentacionCasino,
      maquinas,
    } = req.body;
  
    let updatedFields = {
      nombreCasino,
      ciudadCasino,
      direccionCasino,
      documentacionCasino,
      maquinas,
    };
  
    if (req.files && req.files.imgCasino) {
      const casino = await Casino.findById(req.params.id);
      if (casino.imgCasino && casino.imgCasino.public_id) {
        await deleteImage(casino.imgCasino.public_id);
      }
  
      const result = await uploadImage(req.files.imgCasino.tempFilePath);
      await fs.remove(req.files.imgCasino.tempFilePath);
      updatedFields.imgCasino = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
  
    try {
      const updatedCasino = await Casino.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
      if (!updatedCasino) return res.status(404).json({ message: "Casino no encontrado" });
      res.json(updatedCasino);
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar el casino",
        error: error.message,
      });
    }
  };
  
  // Eliminar un casino
  export const deleteCasino = async (req, res) => {
    try {
      const casino = await Casino.findByIdAndDelete(req.params.id);
      if (!casino) return res.status(404).json({ message: "Casino no encontrado" });
  
      if (casino.imgCasino && casino.imgCasino.public_id) {
        await deleteImage(casino.imgCasino.public_id);
      }
  
      res.json({ message: "Casino eliminado con éxito" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el casino", error: error.message });
    }
  };
  