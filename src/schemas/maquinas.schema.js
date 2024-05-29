import { z } from "zod";

export const createMaquinaSchema = z.object({
  nroSerieMaquina: z.string().min(1, { message: "El número de serie es obligatorio" }),
  nombreMaquina: z.string().min(1, { message: "El nombre de la máquina es obligatorio" }),
  modeloMaquina: z.string().min(1, { message: "El modelo de la máquina es obligatorio" }),
  marcaMaquina: z.string().min(1, { message: "La marca de la máquina es obligatoria" }),
  softwareMaquina: z.string().min(1, { message: "El software de la máquina es obligatorio" }),
  juegoMaquina: z.string().min(1, { message: "El juego de la máquina es obligatorio" }),
  estadoMaquina: z.string().min(1, { message: "El estado de la máquina es obligatorio" }),
  descripcionMaquina: z.string().min(1, { message: "La descripción de la máquina es obligatoria" }),
  ubicacionMaquina: z.string().min(1, { message: "La ubicación de la máquina es obligatoria" }),
  imgMaquina: z.object({
    url: z.string().url(),
    public_id: z.string()
  }).optional(),
  fechaInstalacionMaquina: z.string().min(1, { message: "La fecha de instalación de la máquina es obligatoria" }),
  proveedorMaquina: z.string().min(1, { message: "El proveedor de la máquina es obligatorio" }),
  date: z.string().datetime().optional(),
});
