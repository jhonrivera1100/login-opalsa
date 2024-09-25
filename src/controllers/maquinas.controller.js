import Maquinas from "../models/maquina.model.js";
import { uploadImage, uploadFile, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";
import mongoose from "mongoose"; // Asegúrate de importar mongoose para validar ObjectId

// Traer todas las máquinas
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

// Traer una máquina por su ID
export const traerMaquina = async (req, res) => {
  // Validar si el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de máquina no válido" });
  }

  const maquina = await Maquinas.findById(req.params.id);
  if (!maquina)
    return res.status(404).json({ message: "No se encuentra la máquina" });

  res.json(maquina);
};

// Crear una nueva máquina
export const crearMaquina = async (req, res) => {
  const {
    nroSerieMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    ubicacionMaquina, // Asegúrate de que esto sea siempre una cadena
    fechaInstalacionMaquina,
    proveedorMaquina,
  } = req.body;

  let imgMaquina = {};
  let documentoMaquina = { url: "", public_id: "" }; // Inicializar con valores vacíos

  // Subida de imagen de la máquina
  if (req.files && req.files.imgMaquina) {
    const result = await uploadImage(req.files.imgMaquina.tempFilePath);
    await fs.remove(req.files.imgMaquina.tempFilePath);
    imgMaquina = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Subida de documento de la máquina
  if (req.files && req.files.documentoMaquina) {
    const result = await uploadFile(
      req.files.documentoMaquina.tempFilePath,
      "Documentos"
    );
    await fs.remove(req.files.documentoMaquina.tempFilePath);
    documentoMaquina = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const newMaquina = new Maquinas({
    nroSerieMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    imgMaquina,
    documentoMaquina,
    ubicacionMaquina, // Se espera que sea una cadena
    fechaInstalacionMaquina,
    proveedorMaquina,
    user: req.user.id, // Asegúrate de que req.user.id esté disponible
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

// Actualizar una máquina existente
export const actualizarMaquina = async (req, res) => {
  const {
    nroSerieMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    ubicacionMaquina, // Este campo será actualizado en la transferencia
    fechaInstalacionMaquina,
    proveedorMaquina,
  } = req.body;

  // Validar si el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de máquina no válido" });
  }

  let updatedFields = {
    nroSerieMaquina,
    modeloMaquina,
    marcaMaquina,
    softwareMaquina,
    juegoMaquina,
    estadoMaquina,
    ubicacionMaquina, // Se espera que sea una cadena con el nombre del casino
    fechaInstalacionMaquina,
    proveedorMaquina,
  };

  const maquina = await Maquinas.findById(req.params.id);

  if (!maquina) {
    return res.status(404).json({ message: "No se encuentra la máquina" });
  }

  // Manejo de la imagen de la máquina
  if (req.files && req.files.imgMaquina) {
    if (maquina.imgMaquina && maquina.imgMaquina.public_id) {
      await deleteImage(maquina.imgMaquina.public_id);
    }

    const result = await uploadImage(req.files.imgMaquina.tempFilePath);
    await fs.remove(req.files.imgMaquina.tempFilePath);
    updatedFields.imgMaquina = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Manejo del documento de la máquina
  if (req.files && req.files.documentoMaquina) {
    if (maquina.documentoMaquina && maquina.documentoMaquina.public_id) {
      await deleteImage(maquina.documentoMaquina.public_id);
    }

    const result = await uploadFile(
      req.files.documentoMaquina.tempFilePath,
      "Documentos"
    );
    await fs.remove(req.files.documentoMaquina.tempFilePath);
    updatedFields.documentoMaquina = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  try {
    const updatedMaquina = await Maquinas.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );
    res.json(updatedMaquina);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la máquina",
      error: error.message,
    });
  }
};

// Eliminar una máquina
export const eliminarMaquina = async (req, res) => {
  // Validar si el ID es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID de máquina no válido" });
  }

  try {
    const maquina = await Maquinas.findByIdAndDelete(req.params.id);
    if (!maquina)
      return res.status(404).json({ message: "No se encuentra la máquina" });

    // Elimina la imagen de Cloudinary si existe
    if (maquina.imgMaquina && maquina.imgMaquina.public_id) {
      await deleteImage(maquina.imgMaquina.public_id);
    }

    // Elimina el documento de la máquina de Cloudinary si existe
    if (maquina.documentoMaquina && maquina.documentoMaquina.public_id) {
      await deleteImage(maquina.documentoMaquina.public_id);
    }

    res.json({ message: "Máquina eliminada con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la máquina", error: error.message });
  }
};
