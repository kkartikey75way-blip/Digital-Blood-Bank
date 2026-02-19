import { z } from "zod";

export const emergencyRequestSchema = z.object({
    bloodGroup: z.string().min(1, "Blood group is required"),
    units: z.number().min(1, "At least 1 unit is required"),
    latitude: z.number({ message: "Must be a number" }),
    longitude: z.number({ message: "Must be a number" }),
    urgencyLevel: z.enum(["LOW", "MEDIUM", "HIGH"], {
        message: "Please select urgency level",
    }),
});

export type EmergencyRequestSchemaType = z.infer<typeof emergencyRequestSchema>;
