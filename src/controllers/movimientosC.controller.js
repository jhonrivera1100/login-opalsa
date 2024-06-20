// controllers/movimientosC.controller.js
import MovimientosC from '../models/movimientosC.model.js';
import Maquinas from '../models/maquina.model.js'; // Asegúrate de que la ruta es correcta
import Componente from '../models/componente.model.js'; // Asegúrate de que la ruta es correcta

export const getMovimientosC = async (req, res) => {
  try {
    const movimientos = await MovimientosC.find()
      .populate('componenteId')
      .populate('oldMaquinaId')
      .populate('newMaquinaId');
    res.status(200).json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los movimientos' });
  }
};

export const addMovimientosC = async (req, res) => {
  try {
    const nuevoMovimiento = new MovimientosC(req.body);
    await nuevoMovimiento.save();
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al añadir el movimiento' });
  }
};

export const deleteMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    await MovimientosC.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaccion eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el Transaccion:", error); // Log de error
    res.status(500).json({ message: "Error al eliminar la Transaccion" });
  }
};
