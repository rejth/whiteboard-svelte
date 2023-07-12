import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`);

  io.to(socket.id).emit('event', rooms);

  socket.on('event', (payload) => {
    socket.broadcast.emit('event', payload);
  });
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
