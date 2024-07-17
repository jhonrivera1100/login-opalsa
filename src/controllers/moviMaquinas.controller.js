import MovimientosM from '../models/movimientosM.model.js';
import mongoose from 'mongoose';
import Casinos from '../models/casino.model.js'; // Asumiendo que tienes un modelo de Casino

export const getMovimientosM = async (req, res) => {
  try {
    const movimientos = await MovimientosM.find()
      .populate('maquinaId')
      .populate('oldCasinoId')
      .populate('newCasinoId');
    res.status(200).json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los movimientos' });
  }
};

export const addMovimientosM = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Log de los datos recibidos

    const { maquinaId, oldCasinoNombre, newCasinoNombre, marcaMaquina, serialMaquina } = req.body;

    // Validar que todos los campos requeridos están presentes
    if (!maquinaId || !oldCasinoNombre || !newCasinoNombre || !marcaMaquina || !serialMaquina) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Convertir el ID de la máquina a ObjectId
    const maquinaObjectId = new mongoose.Types.ObjectId(maquinaId);

    // Buscar IDs de los casinos
    const oldCasino = await Casinos.findOne({ nombreCasino: oldCasinoNombre });
    const newCasino = await Casinos.findOne({ nombreCasino: newCasinoNombre });

    if (!oldCasino || !newCasino) {
      return res.status(404).json({ message: 'Casino no encontrado' });
    }

    const nuevoMovimiento = new MovimientosM({
      maquinaId: maquinaObjectId,
      oldCasinoId: oldCasino._id,
      oldCasinoNombre,
      newCasinoId: newCasino._id,
      newCasinoNombre,
      marcaMaquina,
      serialMaquina,
      fechaTransferencia: new Date()
    });

    console.log('Nuevo movimiento de máquina:', nuevoMovimiento); // Log del nuevo objeto de movimiento

    await nuevoMovimiento.save();
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error('Error al añadir el movimiento:', error);
    res.status(500).json({ message: 'Error al añadir el movimiento' });
  }
};

export const deleteMovimientoM = async (req, res) => {
  try {
    const { id } = req.params;
    await MovimientosM.findByIdAndDelete(id);
    res.status(200).json({ message: 'Transacción eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la transacción:', error); // Log de error
    res.status(500).json({ message: 'Error al eliminar la transacción' });
  }
};
