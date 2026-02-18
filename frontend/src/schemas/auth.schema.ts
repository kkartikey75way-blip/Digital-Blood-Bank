import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "DONOR", "PATIENT", "HOSPITAL"], {
        message: "Please select a valid role",
    }),
    bloodGroup: z.string().optional(),
    hospitalName: z.string().optional(),
    licenseNumber: z.string().optional(),
}).refine((data) => {
    if (data.role === "HOSPITAL" && !data.hospitalName) return false;
    return true;
}, {
    message: "Hospital name is required for Hospital accounts",
    path: ["hospitalName"],
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
