import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initIO = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });
    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
