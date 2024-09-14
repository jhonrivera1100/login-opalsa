// controllers/movimientosElementos.controller.js
import MovimientosElementos from '../models/movimientosElementos.model.js'; // Asegúrate de que la ruta es correcta

export const getMovimientosElementos = async (req, res) => {
  try {
    const movimientos = await MovimientosElementos.find()
      .populate('elementoId')
      .populate('oldUbicacionId')
      .populate('newUbicacionId');
    res.status(200).json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los movimientos de elementos' });
  }
};

export const addMovimientosElementos = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body); // Log de los datos recibidos

    const { elementoId, oldUbicacionId, oldUbicacionSerial, newUbicacionId, newUbicacionSerial, nombreElemento, serialElemento } = req.body;

    // Validar que todos los campos requeridos están presentes
    if (!elementoId || !oldUbicacionId || !oldUbicacionSerial || !newUbicacionId || !newUbicacionSerial || !nombreElemento || !serialElemento) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoMovimiento = new MovimientosElementos({
      elementoId,
      oldUbicacionId,
      oldUbicacionSerial,
      newUbicacionId,
      newUbicacionSerial,
      nombreElemento,
      serialElemento,
      fechaTransferencia: new Date()
    });

    await nuevoMovimiento.save();
    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error("Error al añadir el movimiento de elementos:", error);
    res.status(500).json({ message: 'Error al añadir el movimiento de elementos' });
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
