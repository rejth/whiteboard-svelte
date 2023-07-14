import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:4200' },
});

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on('order:add', (payload) => {
    socket.broadcast.emit('order:add', payload);
  });

  socket.on('order:change', (payload) => {
    socket.broadcast.emit('order:change', payload);
  });
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
