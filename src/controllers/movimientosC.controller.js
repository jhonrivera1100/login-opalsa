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
    console.log("Datos recibidos:", req.body); // Log de los datos recibidos

    const { componenteId, oldMaquinaId, oldMaquinaSerial, newMaquinaId, newMaquinaSerial, nombreComponente, serialComponente } = req.body;

    // Validar que todos los campos requeridos están presentes
    if (!componenteId || !oldMaquinaId || !oldMaquinaSerial || !newMaquinaId || !newMaquinaSerial || !nombreComponente || !serialComponente) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoMovimiento = new MovimientosC({
      componenteId,
      oldMaquinaId,
      oldMaquinaSerial,
      newMaquinaId,
      newMaquinaSerial,
      nombreComponente,
      serialComponente,
      fechaTransferencia: new Date()
    });

    await nuevoMovimiento.save();
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error("Error al añadir el movimiento:", error);
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
