import { z } from "zod";

export const updateStockSchema = z.object({
    body: z.object({
        bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
        units: z.number().int().describe("Units can be positive (add) or negative (deduct)"),
    }),
});
