import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  traerMaquina,
  traerMaquinas,
  crearMaquina,
  eliminarMaquina,
  actualizarMaquina,
  traerMaquinasPorCasino,
  traerTodasMaquinas,
  buscarMaquinaPorNumeroDeSerie
  } from "../controllers/maquinas.controller.js";
import { validateSchema } from "../middlewares/validator.js";
import { createMaquinaSchema } from "../schemas/maquinas.schema.js";

const router = Router();


router.get("/maquina", authRequired, traerMaquinas);
router.get("/maquina/all", authRequired, traerTodasMaquinas);
router.get("/maquina/serial", authRequired, buscarMaquinaPorNumeroDeSerie)  // Esta ruta es para mostrar todas las maquinas, sin 
router.get("/maquina/casino", authRequired, traerMaquinasPorCasino);
router.get("/maquina/:id", authRequired, traerMaquina);

router.post(
  "/maquina",
  authRequired,
  validateSchema(createMaquinaSchema),
  crearMaquina
);
router.delete("/maquina/:id", authRequired, eliminarMaquina);
router.put("/maquina/:id", authRequired, actualizarMaquina); 


export default router;
