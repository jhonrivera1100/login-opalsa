import Componente from "../models/componente.model.js";
import Maquinas from "../models/maquina.model.js";
import { uploadFile, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";

// Obtener todos los componentes con detalles del usuario encargado
export const getComponentes = async (req, res) => {
  try {
    // Populate para traer los detalles del usuario encargado
    const componentes = await Componente.find().populate("usuarioEncargado");
    res.json(componentes);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al recuperar los componentes",
        error: error.message,
      });
  }
};

// Obtener un componente por ID con detalles del usuario encargado
export const getComponenteById = async (req, res) => {
  try {
    // Populate para traer los detalles del usuario encargado
    const componente = await Componente.findById(req.params.id).populate(
      "usuarioEncargado"
    );
    if (!componente)
      return res.status(404).json({ message: "Componente no encontrado" });
    res.json(componente);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al recuperar el componente",
        error: error.message,
      });
  }
};

// Crear un componente
export const createComponente = async (req, res) => {
  const { serialComponente, nombreComponente, marcaComponente, maquina } =
    req.body;

  let documentoComponente = {};
  let imagenComponente = {}; // Nuevo campo para la imagen
  let usuarioEncargado = null;

  try {
    // Manejo del documento del componente
    if (req.files && req.files.documentoComponente) {
      const result = await uploadFile(
        req.files.documentoComponente.tempFilePath,
        "Documentos"
      );
      await fs.remove(req.files.documentoComponente.tempFilePath);
      documentoComponente = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Manejo de la imagen del componente
    if (req.files && req.files.imagenComponente) {
      // Manejar la subida de la imagen
      const result = await uploadFile(
        req.files.imagenComponente.tempFilePath,
        "Imagenes"
      );
      await fs.remove(req.files.imagenComponente.tempFilePath);
      imagenComponente = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const nuevoComponente = new Componente({
      serialComponente,
      nombreComponente,
      marcaComponente,
      documentoComponente,
      imagenComponente, // Guardar la imagen
      maquina,
      usuarioEncargado,
    });

    const componenteGuardado = await nuevoComponente.save();

    const maquinaRelacionada = await Maquinas.findById(maquina);
    if (maquinaRelacionada) {
      maquinaRelacionada.componentes.push(componenteGuardado._id);
      await maquinaRelacionada.save();
    }

    res.status(201).json(componenteGuardado);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear el componente", error: error.message });
  }
};

// Actualizar un componente por ID
export const updateComponenteById = async (req, res) => {
  const { id } = req.params;
  const { serialComponente, nombreComponente, marcaComponente, maquina: nuevaMaquina, usuarioEncargado } = req.body;

  try {
    const componente = await Componente.findById(id);
    if (!componente) return res.status(404).json({ message: 'Componente no encontrado' });

    let documentoComponente = componente.documentoComponente;
    let imagenComponente = componente.imagenComponente;

    // Verificar los valores antes de la transferencia
    console.log("Componente actual:", componente);
    console.log("Máquina actual del componente:", componente.maquina);
    console.log("Nueva máquina:", nuevaMaquina);

    // Actualizar el documento si hay uno nuevo
    if (req.files && req.files.documentoComponente) {
      if (documentoComponente.public_id) {
        await deleteImage(documentoComponente.public_id);
      }
      const result = await uploadFile(req.files.documentoComponente.tempFilePath, 'Documentos');
      await fs.remove(req.files.documentoComponente.tempFilePath);
      documentoComponente = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Actualizar la imagen si hay un nuevo archivo
    if (req.files && req.files.imagenComponente) {
      if (imagenComponente.public_id) {
        await deleteImage(imagenComponente.public_id);
      }
      const result = await uploadFile(req.files.imagenComponente.tempFilePath, 'Imagenes');
      await fs.remove(req.files.imagenComponente.tempFilePath);
      imagenComponente = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Si la máquina está cambiando, actualizar las máquinas involucradas
    if (nuevaMaquina && componente.maquina.toString() !== nuevaMaquina) {
      // Remover el componente de la máquina actual
      const maquinaActual = await Maquinas.findById(componente.maquina);
      if (maquinaActual) {
        maquinaActual.componentes.pull(componente._id);
        await maquinaActual.save();
        console.log("Componente removido de la máquina actual:", maquinaActual._id);
      }

      // Agregar el componente a la nueva máquina
      const maquinaNueva = await Maquinas.findById(nuevaMaquina);
      if (maquinaNueva) {
        maquinaNueva.componentes.push(componente._id);
        await maquinaNueva.save();
        console.log("Componente añadido a la nueva máquina:", maquinaNueva._id);
      }

      // Actualizar la máquina del componente
      componente.maquina = nuevaMaquina;
    }

    // Actualizar el componente con la nueva información
    componente.serialComponente = serialComponente || componente.serialComponente;
    componente.nombreComponente = nombreComponente || componente.nombreComponente;
    componente.marcaComponente = marcaComponente || componente.marcaComponente;
    componente.documentoComponente = documentoComponente;
    componente.imagenComponente = imagenComponente;
    componente.usuarioEncargado = usuarioEncargado || componente.usuarioEncargado;

    const componenteActualizado = await componente.save();

    res.json(componenteActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el componente', error: error.message });
  }
};


// Eliminar un componente por ID
export const deleteComponenteById = async (req, res) => {
  try {
    const componenteEliminado = await Componente.findByIdAndDelete(
      req.params.id
    );
    if (!componenteEliminado)
      return res.status(404).json({ message: "Componente no encontrado" });

    // Actualizar la máquina para eliminar la referencia del componente eliminado
    const maquinaRelacionada = await Maquinas.findById(
      componenteEliminado.maquina
    );
    if (maquinaRelacionada) {
      maquinaRelacionada.componentes.pull(componenteEliminado._id);
      await maquinaRelacionada.save();
    }

    // Eliminar el documento del componente de Cloudinary si existe
    if (
      componenteEliminado.documentoComponente &&
      componenteEliminado.documentoComponente.public_id
    ) {
      await deleteImage(componenteEliminado.documentoComponente.public_id);
    }

    res.json(componenteEliminado);
  } catch (error) {
    res
      .status(400)
      .json({
        message: "Error al eliminar el componente",
        error: error.message,
      });
  }
};