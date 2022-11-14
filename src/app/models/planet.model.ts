import { z } from "zod";

export const PlanetModelSchema = z.object({
    climate: z.string(),
    diameter: z.string(),
    gravity: z.string(),
    name: z.string(),
    orbital_period: z.string(),
    population: z.string(),
    residents: z.string().array(),
    rotation_period: z.string(),
    surface_water: z.string(),
    terrain: z.string(),
    url: z.string(),
});

export type PlanetModel = z.infer<typeof PlanetModelSchema>;