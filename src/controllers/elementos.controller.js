import Elementos from "../models/elementos.model.js";
import { uploadImage, uploadFile, deleteImage } from "../libs/cloudinary.js";
import fs from 'fs-extra';

// Obtener todos los elementos
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

export const cambiarUbicacionElemento = async (req, res) => {
  const { nuevoCasinoId } = req.body; // Casino de destino

  try {
    const elemento = await Elementos.findById(req.params.id);
    if (!elemento) {
      return res.status(404).json({ message: "No se encuentra el elemento" });
    }

    // Actualizar la ubicación del elemento
    elemento.ubicacionDeElemento = nuevoCasinoId;

    const elementoActualizado = await elemento.save();
    res.json({
      message: "Ubicación del elemento actualizada con éxito",
      elementoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar la ubicación del elemento",
      error: error.message,
    });
  }
};

// Obtener un elemento por su ID
export const traerElemento = async (req, res) => {
  try {
    const elemento = await Elementos.findById(req.params.id);
    if (!elemento) return res.status(404).json({ message: "No se encuentra el elemento" });
    res.json(elemento);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar el elemento",
      error: error.message,
    });
  }
};

// Obtener elementos por ID del casino
export const traerElementosPorCasino = async (req, res) => {
  try {
    const elementos = await Elementos.find({ ubicacionDeElemento: req.params.casinoId });
    res.json(elementos);
  } catch (error) {
    res.status(500).json({
      message: "Error al recuperar los elementos del casino",
      error: error.message,
    });
  }
};

// Crear un nuevo elemento
export const crearElemento = async (req, res) => {
  const {
    nombreElemento,
    codigoElemento,  // Campo nuevo
    marcaElemento,
    tipoElemento,
    ubicacionDeElemento,
  } = req.body;

  let imgElemento = {};
  let documentacionElemento = {};

  try {
    if (req.files && req.files.imgElemento) {
      const result = await uploadImage(req.files.imgElemento.tempFilePath);
      await fs.remove(req.files.imgElemento.tempFilePath);
      imgElemento = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

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
      codigoElemento,  // Campo nuevo
      marcaElemento,
      tipoElemento,
      imgElemento,
      documentacionElemento,
      ubicacionDeElemento,
    });

    const elementoGuardado = await newElemento.save();
    res.json(elementoGuardado);
  } catch (error) {
    res.status(500).json({
      message: "Error al guardar el elemento",
      error: error.message,
    });
  }
};



// Actualizar un elemento existente
export const actualizarElemento = async (req, res) => {
  const {
    nombreElemento,
    codigoElemento,  // Campo nuevo
    marcaElemento,
    tipoElemento,
    ubicacionDeElemento,
  } = req.body;

  let updatedFields = {
    nombreElemento,
    codigoElemento,  // Campo nuevo
    marcaElemento,
    tipoElemento,
    ubicacionDeElemento,
  };

  try {
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

// Eliminar un elemento
export const eliminarElemento = async (req, res) => {
  try {
    const elemento = await Elementos.findByIdAndDelete(req.params.id);
    if (!elemento) return res.status(404).json({ message: "No se encuentra el elemento" });

    if (elemento.imgElemento && elemento.imgElemento.public_id) {
      await deleteImage(elemento.imgElemento.public_id);
    }

    if (elemento.documentacionElemento && elemento.documentacionElemento.public_id) {
      await deleteImage(elemento.documentacionElemento.public_id);
    }

    res.json({ message: "Elemento eliminado con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el elemento",
      error: error.message,
    });
  }
};
