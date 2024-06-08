import Mantenimiento from '../models/mantenimiento.model.js';
import Maquina from '../models/maquina.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.find();
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mantenimientos', error });
  }
};

export const createMantenimiento = async (req, res) => {
  try {
    const { tipoMantenimiento, fechaMantenimiento, descripcion, nroSerieMaquina, nombreMaquina, ubicacionMaquina } = req.body;
    const archivo = req.files ? req.files.archivo : null;

    // Buscar la máquina por número de serie (este paso puede omitirse ya que ya tienes nombre y ubicación)
    const maquina = await Maquina.findOne({ nroSerieMaquina });
    if (!maquina) {
      return res.status(404).json({ message: 'Máquina no encontrada' });
    }

    const nuevoMantenimiento = new Mantenimiento({
      tipoMantenimiento,
      fechaMantenimiento,
      descripcion,
      nroSerieMaquina,
      nombreMaquina,
      ubicacionMaquina,
      archivo: archivo ? archivo.name : null,
    });

    if (archivo) {
      const uploadPath = path.join(__dirname, '../upload', archivo.name);
      archivo.mv(uploadPath, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al guardar el archivo', error: err });
        }

        try {
          await nuevoMantenimiento.save();
          return res.status(201).json(nuevoMantenimiento);
        } catch (saveError) {
          return res.status(500).json({ message: 'Error al guardar el mantenimiento', error: saveError });
        }
      });
    } else {
      await nuevoMantenimiento.save();
      return res.status(201).json(nuevoMantenimiento);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el mantenimiento', error });
  }
};

export const deleteMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimiento = await Mantenimiento.findByIdAndDelete(id);

    if (!mantenimiento) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }

    // Si hay un archivo asociado, eliminarlo
    if (mantenimiento.archivo) {
      const filePath = path.join(__dirname, '../upload', mantenimiento.archivo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ message: 'Mantenimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el mantenimiento', error });
  }
};