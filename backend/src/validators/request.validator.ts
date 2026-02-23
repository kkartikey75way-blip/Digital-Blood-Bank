import { z } from "zod";

export const createRequestSchema = z.object({
    body: z.object({
        bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
        units: z.number().int().positive("Units must be a positive integer"),
        urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
    }),
});

export const nearbyRequestSchema = z.object({
    query: z.object({
        latitude: z.string().regex(/^-?\d+(\.\d+)?$/, "Latitude must be a number"),
        longitude: z.string().regex(/^-?\d+(\.\d+)?$/, "Longitude must be a number"),
        radius: z.string().regex(/^\d+$/, "Radius must be a positive number"),
        bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
    }),
});
