import Maquinas from "../models/maquina.model.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import fs from 'fs-extra';

export const traerMaquinas = async (req, res) => {
  try {
    const maquinas = await Maquinas.find();
    res.json(maquinas);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar las máquinas",
      error: error.message,
    });
  }
};

export const traerMaquina = async (req, res) => {
  const maquina = await Maquinas.findById(req.params.id);
  if (!maquina) return res.status(404).json({ message: "No se encuentra la máquina" });
  res.json(maquina);
};

export const crearMaquina = async (req, res) => {
  const {
    nroSerieMaquina,
    nombreMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    descripcionMaquina,
    ubicacionMaquina,
    fechaInstalacionMaquina,
    proveedorMaquina,
  } = req.body;

  let imgMaquina = {};

  if (req.files && req.files.imgMaquina) {
    const result = await uploadImage(req.files.imgMaquina.tempFilePath);
    await fs.remove(req.files.imgMaquina.tempFilePath);
    imgMaquina = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const newMaquina = new Maquinas({
    nroSerieMaquina,
    nombreMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    imgMaquina,
    descripcionMaquina,
    ubicacionMaquina,
    fechaInstalacionMaquina,
    proveedorMaquina,
    user: req.user.id, // Asegúrate de que req.user.id está disponible
  });

  try {
    const maquinaGuardada = await newMaquina.save();
    res.json(maquinaGuardada);
  } catch (error) {
    res.status(500).json({
      message: "Error al guardar la máquina",
      error: error.message,
    });
  }
};

export const actualizarMaquina = async (req, res) => {
  const maquina = await Maquinas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!maquina) return res.status(404).json({ message: "No se encuentra la máquina" });
  res.json(maquina);
};

export const eliminarMaquina = async (req, res) => {
  try {
    const maquina = await Maquinas.findByIdAndDelete(req.params.id);
    if (!maquina) return res.status(404).json({ message: "No se encuentra la máquina" });

    // Elimina la imagen de Cloudinary si existe
    if (maquina.imgMaquina && maquina.imgMaquina.public_id) {
      await deleteImage(maquina.imgMaquina.public_id);
    }

    res.json({ message: "Máquina eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la máquina", error: error.message });
  }
};
