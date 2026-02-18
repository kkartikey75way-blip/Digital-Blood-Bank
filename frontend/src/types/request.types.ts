export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH";

export interface CreateEmergencyRequest {
    bloodGroup: string;
    latitude: number;
    longitude: number;
    urgencyLevel: UrgencyLevel;
}
