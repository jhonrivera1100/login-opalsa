import {z} from 'zod';

export const registerSchema = z.object({
username:z.string({
    required_error: 'username is required'
}), 
email: z.string({
    required_error: 'email is required'
}).email({
    message: 'invalid email'
}),
password: z.string({
    required_error:'password is required'
}).min(6,{
    message: "la contraseña tiene que tener 6 caracteres minimo"
}),
});


export const loginSchema = z.object({
    email: z.string({
        required_error: 'email is required'
    }).email({
        message: 'invalid email'
    }),
    password: z.string({
        required_error:'password is required'
    }).min(6,{
        message: "la contraseña tiene que tener 6 caracteres minimo"
    }),
    });