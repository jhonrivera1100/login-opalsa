import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  traerMaquina,
  traerMaquinas,
  crearMaquina,
  eliminarMaquina,
  actualizarMaquina
} from "../controllers/maquinas.controller.js";
import { validateSchema } from "../middlewares/validator.js";
import { createMaquinaSchema } from "../schemas/maquinas.schema.js";
const router = Router();

router.get("/maquina", authRequired, traerMaquinas);
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
