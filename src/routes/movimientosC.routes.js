import { Router } from 'express';
import { getMovimientosC, addMovimientosC } from '../controllers/movimientosC.controller.js';

const router = Router();

// Obtener el historial
router.get('/api/historial', getMovimientosC);

// Crear un nuevo registro en el historial
router.post('/api/historial', addMovimientosC);

export default router;
