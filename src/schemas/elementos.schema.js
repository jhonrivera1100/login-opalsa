import { z } from "zod";

export const createElementoSchema = z.object({
  nombreElemento: z.string().min(1, { message: "El nombre del elemento es obligatorio" }),
  marcaElemento: z.string().min(1, { message: "La marca del elemento es obligatoria" }),
  tipoElemento: z.string().min(1, { message: "El tipo de elemento es obligatorio" }),
  ubicacionDeElemento: z.string().min(1, { message: "La ubicación del elemento es obligatoria" }),
  imgElemento: z.object({
    url: z.string(),
    public_id: z.string(),
  }).optional(),
  documentacionElemento: z.object({
    url: z.string(),
    public_id: z.string(),
  }).optional(),
  date: z.string().datetime().optional(),
});
