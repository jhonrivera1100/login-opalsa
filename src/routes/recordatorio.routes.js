import { Router } from "express";
import { createRecordatorio, getRecordatorios, deleteRecordatorio, updateVisto } from "../controllers/recordatorio.controller.js";

const router = Router();

// Ruta para crear un nuevo recordatorio
router.post("/recordatorios", createRecordatorio);

// Ruta para obtener todos los recordatorios
router.get("/recordatorios", getRecordatorios);

// Ruta para eliminar un recordatorio por ID
router.delete("/recordatorios/:id", deleteRecordatorio);

// Ruta para marcar un recordatorio como visto
router.patch('/recordatorios/:id/visto', updateVisto);

export default router;
