export interface IActivityLog {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    action: string;
    category: "STOCK" | "REQUEST" | "USER" | "ADMIN";
    details: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}
