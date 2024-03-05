"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var http = require("http");
// a websocket server
// Create an HTTP server
var server = http.createServer();
// Create a new instance of Socket.IO and pass the server
var io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
// Listen for connection events
io.on('connection', function (socket) {
    console.log('A user connected');
    // Listen for custom events
    socket.on('donation event', function (message) {
        console.log('Received donation event:', message);
        // Broadcast the message to all connected clients
        io.emit('donation event', message);
    });
    // Listen for disconnection events
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});
// Start the server
var port = 3001;
server.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
