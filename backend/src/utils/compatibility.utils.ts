export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

// map of who each donor type can donate to
const DONATION_MAP: Record<BloodGroup, BloodGroup[]> = {
    "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal Donor
    "O+": ["O+", "A+", "B+", "AB+"],
    "A-": ["A-", "A+", "AB-", "AB+"],
    "A+": ["A+", "AB+"],
    "B-": ["B-", "B+", "AB-", "AB+"],
    "B+": ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
};

// map of who each recipient type can receive from
const RECEPTION_MAP: Record<BloodGroup, BloodGroup[]> = {
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"], // Universal Recipient
    "AB-": ["O-", "A-", "B-", "AB-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "A-": ["O-", "A-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "B-": ["O-", "B-"],
    "O+": ["O-", "O+"],
    "O-": ["O-"],
};

/**
 * Returns a list of blood groups that can receive blood from the given donor blood group.
 */
export const getCompatibleRecipients = (donorGroup: BloodGroup): BloodGroup[] => {
    return DONATION_MAP[donorGroup] || [donorGroup];
};

/**
 * Returns a list of blood groups that can donate blood to the given recipient blood group.
 */
export const getCompatibleDonors = (recipientGroup: BloodGroup): BloodGroup[] => {
    return RECEPTION_MAP[recipientGroup] || [recipientGroup];
};
