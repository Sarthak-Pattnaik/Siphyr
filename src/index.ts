import express, { Response } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// REST API Example
app.get("/messages", async (res: Response) => {
  const messages = await prisma.message.findMany({
    include: { sender: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(messages);
});

// Socket.IO Realtime
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", async ({ content, senderId }) => {
    const message = await prisma.message.create({
      data: { content, senderId }
    });
    io.emit("new_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
