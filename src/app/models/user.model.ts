import { z } from "zod";

export const UserModelSchema = z.object({
    name: z.string(), 
    height: z.string(), 
    mass: z.string(), 
    hair_color: z.string(), 
    skin_color: z.string(), 
    eye_color: z.string(), 
    birth_year: z.string(), 
    gender: z.string(), 
    homeworld: z.string(), 
    films: z.string().array(),
    species: z.string().array(),
    vehicles: z.string().array(),
    starships: z.string().array(),
    created: z.string(),
    edited: z.string(),
    url: z.string(),
    homeworldName: z.string().optional(),
});

export const UsersModelSchema = z.object({
    results: z.array(UserModelSchema),
    count: z.number(),
    previous: z.string().optional().nullable(),
    next: z.string().optional().nullable()
});

export type UserModel = z.infer<typeof UserModelSchema>;
export type UsersModel = z.infer<typeof UsersModelSchema>;