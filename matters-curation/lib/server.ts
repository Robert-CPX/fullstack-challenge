import { Server, Socket } from 'socket.io';
import * as http from 'http'

// a websocket server
// Create an HTTP server
const server = http.createServer();

// Create a new instance of Socket.IO and pass the server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Listen for connection events
io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Listen for custom events
  socket.on('donation event', (message: string) => {
    console.log('Received donation event:', message);

    // Broadcast the message to all connected clients
    io.emit('donation event', message);
  });

  // Listen for disconnection events
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const port = 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});