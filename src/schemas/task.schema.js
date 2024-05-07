import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string({
        required_error: 'title is required'
    }),
    description:z.string({
        required_error: 'la descripcion deberia ser texto'
    }),
    date: z.string().datetime().optional(),
});