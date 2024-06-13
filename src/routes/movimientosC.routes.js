import { Router } from 'express';
import { getMovimientosC, addMovimientosC } from '../controllers/movimientosC.controller.js';

const router = Router();

// Obtener el historial
router.get('/movimientosC', getMovimientosC);

// Crear un nuevo registro en el historial
router.post('/movimientosC', addMovimientosC);

export default router;
