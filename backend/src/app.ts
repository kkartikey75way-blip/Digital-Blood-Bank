import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import donorRoutes from "./routes/donor.routes";
import requestRoutes from "./routes/request.routes";
import hospitalRoutes from "./routes/hospital.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Health Route
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Blood Bank API Running !!",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/hospitals", hospitalRoutes);

export default app;
