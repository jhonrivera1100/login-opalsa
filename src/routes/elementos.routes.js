import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  traerElemento,
  traerElementos,
  crearElemento,
  eliminarElemento,
  actualizarElemento,
} from "../controllers/elementos.controller.js";
import { validateSchema } from "../middlewares/validator.js";
import { createElementoSchema } from "../schemas/elementos.schema.js";

const router = Router();

router.get("/elemento", authRequired, traerElementos);
router.get("/elemento/:id", authRequired, traerElemento);
router.post(
  "/elemento",
  authRequired,
  validateSchema(createElementoSchema),
  crearElemento
);
router.delete("/elemento/:id", authRequired, eliminarElemento);
router.put("/elemento/:id", authRequired, actualizarElemento);

export default router;
