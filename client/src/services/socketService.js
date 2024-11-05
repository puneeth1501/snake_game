// // cient/src/service/socketService.js
// import { io } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:3001';

// const socket = io(SOCKET_URL, {
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//     timeout: 10000,
//     transports: ['websocket']
// });

// socket.on('connect', () => {
//     console.log('Connected to server');
// });

// socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error);
// });

// socket.on('disconnect', () => {
//     console.log('Disconnected from server');
// });

// socket.on('error', (error) => {
//     console.error('Socket error:', error);
// });

// export default socket;

// cient/src/service/socketService.js
// import { io } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:3001';

// const socket = io(SOCKET_URL, {
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//     timeout: 10000,
//     transports: ['websocket', 'polling'], // Add polling as fallback
//     autoConnect: true
// });

// socket.on('connect', () => {
//     console.log('Connected to server:', SOCKET_URL);
// });

// socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error);
//     // Try to reconnect
//     setTimeout(() => {
//         socket.connect();
//     }, 1000);
// });

// socket.on('disconnect', (reason) => {
//     console.log('Disconnected from server. Reason:', reason);
// });

// socket.on('error', (error) => {
//     console.error('Socket error:', error);
// });

// // Manually connect
// socket.connect();

// export default socket;

// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001', {
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//     timeout: 10000,
//     transports: ['websocket']
// });

// socket.on('connect', () => {
//     console.log('Connected to server');
// });

// socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error);
// });

// socket.on('disconnect', () => {
//     console.log('Disconnected from server');
// });

// export default socket;

// src/service/socketService.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

export default socket;