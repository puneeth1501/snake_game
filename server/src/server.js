
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const Game = require('./gameLogic');

// const app = express();
// app.use(cors({
//     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//     methods: ["GET", "POST"],
//     credentials: true
// }));

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// // Store active games
// const games = new Map();

// // Get available rooms
// function getAvailableRooms() {
//     const rooms = [];
//     games.forEach((game, id) => {
//         rooms.push({
//             id: id,
//             playerCount: game.players.length,
//             maxPlayers: Game.RULES.MAX_PLAYERS,
//             status: game.status
//         });
//     });
//     return rooms;
// }

// // Broadcast room updates to all clients
// function broadcastRooms() {
//     io.emit('availableRooms', getAvailableRooms());
// }

// io.on('connection', (socket) => {
//     console.log('Player connected:', socket.id);

//     // Immediately send available rooms to newly connected client
//     socket.emit('availableRooms', getAvailableRooms());

//     // Handle room list request
//     socket.on('getRooms', () => {
//         socket.emit('availableRooms', getAvailableRooms());
//     });

//     // Create game
//     socket.on('createGame', ({ playerName }) => {
//         try {
//             const gameId = 'game-' + Math.random().toString(36).substring(7);
//             const game = new Game(gameId);

//             // Add first player
//             const player = {
//                 id: socket.id,
//                 name: playerName,
//                 position: 1
//             };

//             game.addPlayer(player);
//             games.set(gameId, game);

//             // Join socket room
//             socket.join(gameId);
            
//             // Send game state to creator
//             socket.emit('gameCreated', game.getState());
            
//             // Broadcast updated room list to all clients
//             broadcastRooms();

//             console.log(`Game created: ${gameId} by ${playerName}`);
//         } catch (error) {
//             console.error('Error creating game:', error);
//             socket.emit('error', 'Failed to create game');
//         }
//     });

//     // Join game
//     socket.on('joinGame', ({ gameId, playerName }) => {
//         try {
//             const game = games.get(gameId);
            
//             if (!game) {
//                 socket.emit('error', 'Game not found');
//                 return;
//             }

//             if (game.players.length >= Game.RULES.MAX_PLAYERS) {
//                 socket.emit('error', 'Game is full');
//                 return;
//             }

//             // Add new player
//             const player = {
//                 id: socket.id,
//                 name: playerName,
//                 position: 1
//             };

//             game.addPlayer(player);
//             socket.join(gameId);

//             // Send updated game state to all players in the room
//             io.to(gameId).emit('gameState', game.getState());
            
//             // Broadcast updated room list
//             broadcastRooms();

//             console.log(`Player ${playerName} joined game: ${gameId}`);
//         } catch (error) {
//             console.error('Error joining game:', error);
//             socket.emit('error', 'Failed to join game');
//         }
//     });

//     // Handle dice roll
//     socket.on('rollDice', ({ gameId }) => {
//         const game = games.get(gameId);
//         if (!game) return;

//         const diceValue = Math.floor(Math.random() * 6) + 1;
//         const result = game.makeMove(socket.id, diceValue);

//         if (result.success) {
//             io.to(gameId).emit('gameState', game.getState());
//         }
//     });

//     // Handle chat messages
//     socket.on('sendMessage', ({ gameId, message, sender }) => {
//         const game = games.get(gameId);
//         if (!game) return;

//         const messageData = {
//             sender,
//             message,
//             timestamp: new Date().toISOString()
//         };

//         // Broadcast message to all players in the game
//         io.to(gameId).emit('chatMessage', messageData);
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Player disconnected:', socket.id);

//         // Check all games for the disconnected player
//         games.forEach((game, gameId) => {
//             const playerIndex = game.players.findIndex(p => p.id === socket.id);
//             if (playerIndex !== -1) {
//                 game.players.splice(playerIndex, 1);
                
//                 // Remove game if empty
//                 if (game.players.length === 0) {
//                     games.delete(gameId);
//                 } else {
//                     // Update game state for remaining players
//                     io.to(gameId).emit('gameState', game.getState());
//                 }
                
//                 // Broadcast updated room list
//                 broadcastRooms();
//             }
//         });
//     });
// });

// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const Game = require('./gameLogic');

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(cors({
//     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//     methods: ["GET", "POST"],
//     credentials: true
// }));

// // Basic route handlers
// app.get('/', (req, res) => {
//     res.json({ message: 'Snake and Ladder Game Server Running' });
// });

// app.get('/health', (req, res) => {
//     res.json({ status: 'ok' });
// });

// // Create HTTP server
// const server = http.createServer(app);

// // Initialize Socket.IO
// const io = new Server(server, {
//     cors: {
//         origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });

// // Store active games
// const games = new Map();

// // Get available rooms
// function getAvailableRooms() {
//     const rooms = [];
//     games.forEach((game, id) => {
//         if (game.status === 'waiting') {
//             rooms.push({
//                 id: id,
//                 playerCount: game.players.length,
//                 maxPlayers: Game.RULES.MAX_PLAYERS,
//                 status: game.status
//             });
//         }
//     });
//     return rooms;
// }

// // Broadcast room updates
// function broadcastRooms() {
//     io.emit('availableRooms', getAvailableRooms());
// }

// // Socket connection handling
// io.on('connection', (socket) => {
//     console.log('Player connected:', socket.id);

//     // Send available rooms to new client
//     socket.emit('availableRooms', getAvailableRooms());

//     // Handle room list request
//     socket.on('getRooms', () => {
//         socket.emit('availableRooms', getAvailableRooms());
//     });

//     // Create game
//     socket.on('createGame', ({ playerName }) => {
//         try {
//             const gameId = 'game-' + Math.random().toString(36).substring(7);
//             const game = new Game(gameId);

//             const player = {
//                 id: socket.id,
//                 name: playerName,
//                 position: 1
//             };

//             game.addPlayer(player);
//             games.set(gameId, game);

//             socket.join(gameId);
//             socket.emit('gameCreated', game.getState());
//             broadcastRooms();

//             console.log(`Game created: ${gameId} by ${playerName}`);
//         } catch (error) {
//             console.error('Error creating game:', error);
//             socket.emit('error', 'Failed to create game');
//         }
//     });

//     // Join game
//     socket.on('joinGame', ({ gameId, playerName }) => {
//         try {
//             const game = games.get(gameId);
            
//             if (!game) {
//                 socket.emit('error', 'Game not found');
//                 return;
//             }

//             if (game.players.length >= Game.RULES.MAX_PLAYERS) {
//                 socket.emit('error', 'Game is full');
//                 return;
//             }

//             const player = {
//                 id: socket.id,
//                 name: playerName,
//                 position: 1
//             };

//             game.addPlayer(player);
//             socket.join(gameId);

//             io.to(gameId).emit('gameState', game.getState());
//             broadcastRooms();

//             console.log(`Player ${playerName} joined game: ${gameId}`);
//         } catch (error) {
//             console.error('Error joining game:', error);
//             socket.emit('error', 'Failed to join game');
//         }
//     });

//     // Handle dice roll
//     socket.on('rollDice', ({ gameId }) => {
//         const game = games.get(gameId);
//         if (!game) return;

//         const diceValue = Math.floor(Math.random() * 6) + 1;
//         const result = game.makeMove(socket.id, diceValue);

//         if (result.success) {
//             io.to(gameId).emit('gameState', game.getState());
//         }
//     });

//     // Handle chat messages
//     socket.on('sendMessage', ({ gameId, message, sender }) => {
//         const game = games.get(gameId);
//         if (!game) return;

//         const messageData = {
//             sender,
//             message,
//             timestamp: new Date().toISOString()
//         };

//         // Store message in game state
//         game.messages.push(messageData);

//         // Broadcast to all players in the game
//         io.to(gameId).emit('chatMessage', messageData);
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('Player disconnected:', socket.id);

//         games.forEach((game, gameId) => {
//             if (game.removePlayer(socket.id)) {
//                 if (game.players.length === 0) {
//                     games.delete(gameId);
//                 } else {
//                     io.to(gameId).emit('gameState', game.getState());
//                 }
//                 broadcastRooms();
//             }
//         });
//     });
// });

// // Error handling middleware
// app.use((req, res, next) => {
//     res.status(404).json({ error: 'Not Found' });
// });

// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: 'Something broke!' });
// });

// // Start server
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// }).on('error', (error) => {
//     console.error('Server error:', error);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//     server.close(() => {
//         console.log('Server shut down gracefully');
//         process.exit(0);
//     });
// });



const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Game = require('./gameLogic');

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store active games
const games = new Map();

// Get available rooms
function getAvailableRooms() {
    const rooms = [];
    games.forEach((game, id) => {
        rooms.push({
            id: id,
            playerCount: game.players.length,
            maxPlayers: Game.RULES.MAX_PLAYERS,
            status: game.status
        });
    });
    return rooms;
}

// Broadcast room updates to all clients
function broadcastRooms() {
    io.emit('availableRooms', getAvailableRooms());
}

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    // Immediately send available rooms to newly connected client
    socket.emit('availableRooms', getAvailableRooms());

    // Handle room list request
    socket.on('getRooms', () => {
        socket.emit('availableRooms', getAvailableRooms());
    });

    // Create game
    socket.on('createGame', ({ playerName }) => {
        try {
            const gameId = 'game-' + Math.random().toString(36).substring(7);
            const game = new Game(gameId);

            // Add first player
            const player = {
                id: socket.id,
                name: playerName,
                position: 1
            };

            game.addPlayer(player);
            games.set(gameId, game);

            // Join socket room
            socket.join(gameId);
            
            // Send game state to creator
            socket.emit('gameCreated', game.getState());
            
            // Broadcast updated room list to all clients
            broadcastRooms();

            console.log(`Game created: ${gameId} by ${playerName}`);
        } catch (error) {
            console.error('Error creating game:', error);
            socket.emit('error', 'Failed to create game');
        }
    });

    // Join game
    socket.on('joinGame', ({ gameId, playerName }) => {
        try {
            const game = games.get(gameId);
            
            if (!game) {
                socket.emit('error', 'Game not found');
                return;
            }

            if (game.players.length >= Game.RULES.MAX_PLAYERS) {
                socket.emit('error', 'Game is full');
                return;
            }

            // Add new player
            const player = {
                id: socket.id,
                name: playerName,
                position: 1
            };

            game.addPlayer(player);
            socket.join(gameId);

            // Send updated game state to all players in the room
            io.to(gameId).emit('gameState', game.getState());
            
            // Broadcast updated room list
            broadcastRooms();

            console.log(`Player ${playerName} joined game: ${gameId}`);
        } catch (error) {
            console.error('Error joining game:', error);
            socket.emit('error', 'Failed to join game');
        }
    });

    // Handle dice roll
    socket.on('rollDice', ({ gameId }) => {
        const game = games.get(gameId);
        if (!game) return;

        const diceValue = Math.floor(Math.random() * 6) + 1;
        const result = game.makeMove(socket.id, diceValue);

        if (result.success) {
            io.to(gameId).emit('gameState', game.getState());
        }
    });

    // Handle chat messages
    socket.on('sendMessage', ({ gameId, message, sender }) => {
        const game = games.get(gameId);
        if (!game) return;

        const messageData = {
            sender,
            message,
            timestamp: new Date().toISOString()
        };

        // Broadcast message to all players in the game
        io.to(gameId).emit('chatMessage', messageData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);

        // Check all games for the disconnected player
        games.forEach((game, gameId) => {
            const playerIndex = game.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                game.players.splice(playerIndex, 1);
                
                // Remove game if empty
                if (game.players.length === 0) {
                    games.delete(gameId);
                } else {
                    // Update game state for remaining players
                    io.to(gameId).emit('gameState', game.getState());
                }
                
                // Broadcast updated room list
                broadcastRooms();
            }
        });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
