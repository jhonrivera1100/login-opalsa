import MovimientosC from '../models/movimientosC.model.js';

export const getMovimientosC = async (req, res) => {
  try {
    const movimientosC = await MovimientosC.find().populate('componenteId oldMaquinaId newMaquinaId');
    res.json(movimientosC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMovimientosC = async (req, res) => {
  const { componenteId, oldMaquinaId, oldMaquinaSerial, newMaquinaId, newMaquinaSerial, nombreComponente, serialComponente } = req.body;

  const newMovimientosC = new MovimientosC({
    componenteId,
    oldMaquinaId,
    oldMaquinaSerial,
    newMaquinaId,
    newMaquinaSerial,
    nombreComponente,
    serialComponente,
  });

  try {
    const savedMovimientosC = await newMovimientosC.save();
    res.status(201).json(savedMovimientosC);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
