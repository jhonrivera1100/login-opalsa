import { Router } from "express";
import {getOrdenes, createOrden, deleteOrden, respuestaOrden, getOrdenesByUser, obtenerOrdenPorId} from "../controllers/orden.controller.js";

const router = Router();

// Obtener todas las ordenes

router.get("/ordenes", getOrdenes);

// Obtener órdenes del usuario autenticado
router.get("/ordenes", getOrdenesByUser);

// Ruta para obtener una orden por ID
router.get('/ordenes/:id', obtenerOrdenPorId);

// Crear una nueva orden

router.post("/ordenes", createOrden);

// Responder a una orden

router.put("/ordenes/:id", respuestaOrden);

// Eliminar una orden

router.delete("/ordenes/:id", deleteOrden);

export default router;
