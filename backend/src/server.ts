import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";

import { initIO } from "./utils/io";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = initIO(server);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId: string) => {
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} !!`);
    });
};

startServer();
