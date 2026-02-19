import nodemailer from "nodemailer";
import { Notification, NotificationType } from "../models/notification.model";
import { User } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const createNotification = async (
    recipientId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string
) => {
    try {
        // 1. Save to DB
        const notification = await Notification.create({
            recipient: recipientId,
            type,
            title,
            message,
            relatedId,
        });

        // 2. Fetch User Email
        const user = await User.findById(recipientId);
        if (user && user.email) {
            // 3. Send Email (Non-blocking)
            sendEmail(user.email, title, message).catch(err => console.error("Email send failed:", err));
        }

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
    }
};

const sendEmail = async (to: string, subject: string, text: string) => {
    const info = await transporter.sendMail({
        from: `"Digital Blood Bank" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #e11d48;">${subject}</h2>
                <p style="font-size: 16px; color: #334155;">${text}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #94a3b8;">This is an automated message from Digital Blood Bank. Please do not reply.</p>
            </div>
        `,
    });

    console.log("Message sent: %s", info.messageId);
};

export const notifyUrgentNearby = async (requestId: string, bloodGroup: string, lat: number, lng: number) => {
    // Find donors within 5km of the emergency
    const nearbyDonors = await User.find({
        role: "DONOR",
        isAvailable: true,
        bloodGroup,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
                $maxDistance: 5000, // 5km
            },
        },
    });

    for (const donor of nearbyDonors) {
        await createNotification(
            donor._id.toString(),
            NotificationType.URGENT_NEARBY,
            "Urgent Blood Request Nearby!",
            `An emergency request for ${bloodGroup} has been created within 5km of your location. Please check the dashboard to respond.`,
            requestId
        );
    }
};
