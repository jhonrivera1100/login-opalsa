// controllers/movimientosElementos.controller.js
import MovimientosElementos from '../models/movimientosElementos.model.js'; // Asegúrate de que la ruta es correcta
import Casinos from '../models/casino.model.js';
import mongoose from 'mongoose';

export const getMovimientosElementos = async (req, res) => {
  try {
    const movimientosElm = await MovimientosElementos.find()
      .populate('codigoElemento')
      .populate('oldUbicacionId')
      .populate('newUbicacionId');
    res.status(200).json(movimientosElm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los movimientos elementos' });
  }
};


export const addMovimientosElementos = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Log de los datos recibidos

    const { elementoId, oldUbicacionNombre, newUbicacionNombre, nombreElemento, codigoElemento } = req.body;

    // Validar que todos los campos requeridos están presentes
    if (!elementoId || !oldUbicacionNombre || !newUbicacionNombre || !nombreElemento || !codigoElemento) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Convertir el ID de la máquina a ObjectId
    const ElemntosObjectId = new mongoose.Types.ObjectId(elementoId);

    // Buscar IDs de los casinos
    const oldUbicacion = await Casinos.findOne({ nombreCasino: oldUbicacionNombre });
    const newUbicacion = await Casinos.findOne({ nombreCasino: newUbicacionNombre });

    if (!oldUbicacion || !newUbicacion) {
      return res.status(404).json({ message: 'Ubicacion no encontrada' });
    }

    const nuevoMovimientoElm = new MovimientosElementos({
      elementoId: ElemntosObjectId,
      oldUbicacionId: oldUbicacion._id,
      oldUbicacionNombre,
      newUbicacionId: newUbicacion._id,
      newUbicacionNombre,
      nombreElemento,
      codigoElemento,
      fechaTransferenciaElm: new Date()
    });

    console.log('Nuevo movimiento de máquina:', nuevoMovimientoElm); // Log del nuevo objeto de movimiento

    await nuevoMovimientoElm.save();
    res.status(201).json(nuevoMovimientoElm);
  } catch (error) {
    console.error('Error al añadir el movimiento de elemento:', error);
    res.status(500).json({ message: 'Error al añadir el movimiento de elemento' });
  }
};


export const deleteMovimientoElemento = async (req, res) => {
  try {
    const { id } = req.params;
    await MovimientosElementos.findByIdAndDelete(id);
    res.status(200).json({ message: "Movimiento de elementos eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el movimiento de elementos:", error); // Log de error
    res.status(500).json({ message: "Error al eliminar el movimiento de elementos" });
  }
};
