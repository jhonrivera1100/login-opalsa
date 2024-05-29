import { Router } from "express";
import { createRecordatorio, getRecordatorios, deleteRecordatorio } from "../controllers/recordatorio.controller.js";

const router = Router();

// Ruta para crear un nuevo recordatorio
router.post("/recordatorios", createRecordatorio);

// Ruta para obtener todos los recordatorios
router.get("/recordatorios", getRecordatorios);

// Ruta para eliminar un recordatorio por ID
router.delete("/recordatorios/:id", deleteRecordatorio);

export default router;