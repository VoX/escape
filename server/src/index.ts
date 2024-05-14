import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async (socket) => {
  socket.on("chatMessage", (message) => {
    console.log(message);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}!`));
