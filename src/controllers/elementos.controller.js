import Elementos from "../models/elementos.model.js";
import { uploadImage, uploadFile, deleteImage } from "../libs/cloudinary.js";
import fs from 'fs-extra';

export const traerElementos = async (req, res) => {
  try {
    const elementos = await Elementos.find();
    res.json(elementos);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar los elementos",
      error: error.message,
    });
  }
};

export const traerElemento = async (req, res) => {
  const elemento = await Elementos.findById(req.params.id);
  if (!elemento) return res.status(404).json({ message: "No se encuentra el elemento" });
  res.json(elemento);
};

export const crearElemento = async (req, res) => {
  const {
    nombreElemento,
    marcaElemento,
    tipoElemento,
    ubicacionDeElemento,
  } = req.body;

  let imgElemento = {};
  let documentacionElemento = {};

  if (req.files && req.files.imgElemento) {
    const result = await uploadImage(req.files.imgElemento.tempFilePath);
    await fs.remove(req.files.imgElemento.tempFilePath);
    imgElemento = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Manejo del documento del elemento
  if (req.files && req.files.documentacionElemento) {
    const result = await uploadFile(req.files.documentacionElemento.tempFilePath, 'Documentos');
    await fs.remove(req.files.documentacionElemento.tempFilePath);
    documentacionElemento = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const newElemento = new Elementos({
    nombreElemento,
    marcaElemento,
    tipoElemento,
    imgElemento,
    documentacionElemento,
    ubicacionDeElemento,
    user: req.user.id, // Asegúrate de que req.user.id está disponible
  });

  try {
    const elementoGuardado = await newElemento.save();
    res.json(elementoGuardado);
  } catch (error) {
    res.status(500).json({
      message: "Error al guardar el elemento",
      error: error.message,
    });
  }
};

export const actualizarElemento = async (req, res) => {
  const {
    nombreElemento,
    marcaElemento,
    tipoElemento,
    ubicacionDeElemento,
  } = req.body;

  let updatedFields = {
    nombreElemento,
    marcaElemento,
    tipoElemento,
    ubicacionDeElemento,
  };

  // Manejo de la imagen del elemento
  if (req.files && req.files.imgElemento) {
    const elemento = await Elementos.findById(req.params.id);
    if (elemento.imgElemento && elemento.imgElemento.public_id) {
      await deleteImage(elemento.imgElemento.public_id);
    }

    const result = await uploadImage(req.files.imgElemento.tempFilePath);
    await fs.remove(req.files.imgElemento.tempFilePath);
    updatedFields.imgElemento = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Manejo del documento del elemento
  if (req.files && req.files.documentacionElemento) {
    const elemento = await Elementos.findById(req.params.id);
    if (elemento.documentacionElemento && elemento.documentacionElemento.public_id) {
      await deleteImage(elemento.documentacionElemento.public_id);
    }

    const result = await uploadFile(req.files.documentacionElemento.tempFilePath, 'Documentos');
    await fs.remove(req.files.documentacionElemento.tempFilePath);
    updatedFields.documentacionElemento = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  try {
    const updatedElemento = await Elementos.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    if (!updatedElemento) return res.status(404).json({ message: "No se encuentra el elemento" });
    res.json(updatedElemento);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el elemento",
      error: error.message,
    });
  }
};

export const eliminarElemento = async (req, res) => {
  try {
    const elemento = await Elementos.findByIdAndDelete(req.params.id);
    if (!elemento) return res.status(404).json({ message: "No se encuentra el elemento" });

    // Elimina la imagen de Cloudinary si existe
    if (elemento.imgElemento && elemento.imgElemento.public_id) {
      await deleteImage(elemento.imgElemento.public_id);
    }

    // Elimina el documento del elemento de Cloudinary si existe
    if (elemento.documentacionElemento && elemento.documentacionElemento.public_id) {
      await deleteImage(elemento.documentacionElemento.public_id);
    }

    res.json({ message: "Elemento eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el elemento", error: error.message });
  }
};
