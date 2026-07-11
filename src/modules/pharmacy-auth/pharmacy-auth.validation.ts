
import { z } from "zod";

export const pharmacyLoginSchema = z.object({
    email: z
        .string()
        .email("Invalid email"),

    password: z
        .string()
        .min(1, "Password is required"),
});