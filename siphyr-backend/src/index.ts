import express, { Request, Response } from "express";
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
app.get("/messages", async (_req:Request, res: Response) => {
  const messages = await prisma.message.findMany({
    include: { sender: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(messages);
});

app.post("/messages", async (req: Request, res: Response) => {
  const { content, senderId } = req.body;

  if (!content || !senderId) {
    return res.status(400).json({ error: "content and senderId are required" });
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId
      }
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
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

app.post("/users", async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  try {
    const user = await prisma.user.create({ data: { username } });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Username may already exist" });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});