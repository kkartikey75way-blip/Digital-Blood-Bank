import { z } from "zod";

export const updateStockSchema = z.object({
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
        message: "Please select a blood group",
    }),
    units: z.number({
        message: "Units must be a number",
    }).min(0, "Units cannot be negative"),
});

export type UpdateStockSchemaType = z.infer<typeof updateStockSchema>;
