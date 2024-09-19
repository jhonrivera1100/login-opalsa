import Casino from "../models/casino.model.js";
import { uploadImage, uploadFile, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";

// Obtener todos los casinos
export const getAllCasinos = async (req, res) => {
  try {
    const casinos = await Casino.find().populate("maquinas elementos");
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
    const casino = await Casino.findById(req.params.id).populate("maquinas");
    if (!casino)
      return res.status(404).json({ message: "Casino no encontrado" });
    res.json(casino);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el casino", error: error.message });
  }
};

// Crear un nuevo casino
export const createCasino = async (req, res) => {
  const { nombreCasino, ciudadCasino, direccionCasino } = req.body;

  let imgCasino = {};
  let documentacionLegal = [];
  let usoDeSuelos = [];
  let colJuegos = [];
  let otrosDocumentos = [];

  try {
    // Manejo de la imagen de casino
    if (req.files && req.files.imgCasino) {
      const result = await uploadImage(req.files.imgCasino.tempFilePath);
      await fs.remove(req.files.imgCasino.tempFilePath);
      imgCasino = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Procesar los documentos con sus categorías
    for (const [key, file] of Object.entries(req.files)) {
      if (key !== "imgCasino") {
        const category =
          req.body[`documents[${key.split("[")[1]?.split("]")[0]}][category]`];

        const result = await uploadFile(file.tempFilePath, category);
        await fs.remove(file.tempFilePath);

        const docInfo = { url: result.secure_url, public_id: result.public_id };

        switch (category) {
          case "documentacionLegal":
            documentacionLegal.push(docInfo);
            break;
          case "usoDeSuelos":
            usoDeSuelos.push(docInfo);
            break;
          case "colJuegos":
            colJuegos.push(docInfo);
            break;
          case "otrosDocumentos":
            otrosDocumentos.push(docInfo);
            break;
          default:
            break;
        }
      }
    }

    const newCasino = new Casino({
      nombreCasino,
      imgCasino,
      ciudadCasino,
      direccionCasino,
      documentacionLegal,
      usoDeSuelos,
      colJuegos,
      otrosDocumentos,
    });

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
  const { nombreCasino, ciudadCasino, direccionCasino, maquinas } = req.body;

  let updatedFields = {
    nombreCasino,
    ciudadCasino,
    direccionCasino,
    maquinas,
  };

  // Manejo de la imagen de casino
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

  // Manejo de los documentos de casino
  if (req.files && req.files.documentacionCasino) {
    const casino = await Casino.findById(req.params.id);

    // Borra los documentos anteriores si es necesario
    if (casino.documentacionCasino && casino.documentacionCasino.length) {
      for (let doc of casino.documentacionCasino) {
        if (doc.public_id) {
          await deleteImage(doc.public_id);
        }
      }
    }

    updatedFields.documentacionCasino = [];
    if (Array.isArray(req.files.documentacionCasino)) {
      for (let file of req.files.documentacionCasino) {
        const result = await uploadFile(file.tempFilePath, "Documentos");
        await fs.remove(file.tempFilePath);
        updatedFields.documentacionCasino.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    } else {
      const result = await uploadFile(
        req.files.documentacionCasino.tempFilePath,
        "Documentos"
      );
      await fs.remove(req.files.documentacionCasino.tempFilePath);
      updatedFields.documentacionCasino.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }

  try {
    const updatedCasino = await Casino.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );
    if (!updatedCasino)
      return res.status(404).json({ message: "Casino no encontrado" });
    res.json(updatedCasino);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el casino",
      error: error.message,
    });
  }
};

export const getCasinoElementos = async (req, res) => {
  try {
    const { id } = req.params;
    const casino = await Casino.findById(id).populate("elementos");

    if (!casino) {
      return res.status(404).json({ message: "Casino no encontrado" });
    }

    res.json(casino.elementos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los elementos del casino",
      error: error.message,
    });
  }
};

// Eliminar un casino
export const deleteCasino = async (req, res) => {
  try {
    const casino = await Casino.findByIdAndDelete(req.params.id);
    if (!casino)
      return res.status(404).json({ message: "Casino no encontrado" });

    if (casino.imgCasino && casino.imgCasino.public_id) {
      await deleteImage(casino.imgCasino.public_id);
    }

    if (casino.documentacionCasino && casino.documentacionCasino.length) {
      for (let doc of casino.documentacionCasino) {
        if (doc.public_id) {
          await deleteImage(doc.public_id);
        }
      }
    }

    res.json({ message: "Casino eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el casino", error: error.message });
  }
};
