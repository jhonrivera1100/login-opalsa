import { Router } from "express";
import {getOrdenes, createOrden, deleteOrden, updateOrdenAsignados, getOrdenesByUser, obtenerOrdenPorId, updateAceptar, updateOrdenSobrantes} from "../controllers/orden.controller.js";

const router = Router();

// Obtener todas las ordenes

router.get("/ordenes", getOrdenes);

// Obtener órdenes del usuario autenticado

// Ruta para obtener una orden por ID
router.get('/ordenes/:id', obtenerOrdenPorId);

// Obtener órdenes por usuario autenticado
router.get('/ordenes/user/:id', getOrdenesByUser);


// Crear una nueva orden

router.post("/ordenes", createOrden);

// mandar componentes sobrantes

router.put("/ordenes/:id", updateOrdenAsignados);

// post la orden con los sobrantes

router.put('/ordenes/:id/sobrantes', updateOrdenSobrantes);

// Eliminar una orden

router.delete("/ordenes/:id", deleteOrden);

// Aceptar una orden

router.patch("/ordenes/:id/aceptar", updateAceptar);

export default router;
