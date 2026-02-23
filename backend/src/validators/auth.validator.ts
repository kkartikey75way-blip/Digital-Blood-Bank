import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["ADMIN", "DONOR", "HOSPITAL", "PATIENT"]),
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
        bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).optional(),
        city: z.string().min(2).optional(),
        address: z.string().min(5).optional(),
        hospitalName: z.string().optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
    }).refine(data => {
        if (data.role === "HOSPITAL" && !data.hospitalName) return false;
        return true;
    }, {
        message: "Hospital name is required for Hospital role",
        path: ["hospitalName"]
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
});
