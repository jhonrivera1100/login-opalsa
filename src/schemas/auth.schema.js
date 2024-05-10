import {z} from 'zod';

export const registerSchema = z.object({
username:z.string({
    required_error: 'username es requerido'
}), 
email: z.string({
    required_error: 'email es requerido'
}).email({
    message: 'el email no es valido'
}),
password: z.string({
    required_error:'password es requerido'
}).min(6,{
    message: "la contraseña tiene que tener 6 caracteres minimo"
}),
});


export const loginSchema = z.object({
    email: z.string({
        required_error: 'email es requerido'
    }).email({
        message: 'el email no es valido'
    }),
    password: z.string({
        required_error:'password es requerido'
    }).min(6,{
        message: "la contraseña tiene que tener 6 caracteres minimo"
    }),
    });