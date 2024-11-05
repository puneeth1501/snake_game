// // cient/src/components/GameLobby.js
// import React, { useState, useEffect } from 'react';
// import socket from '../service/socketService';

// function GameLobby() {
//     const [playerName, setPlayerName] = useState('');
//     const [gameId, setGameId] = useState('');
//     const [availableRooms, setAvailableRooms] = useState([]);
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         // Listen for available rooms updates
//         socket.on('availableRooms', (rooms) => {
//             console.log('Received rooms:', rooms);
//             setAvailableRooms(rooms);
//         });

//         // Listen for errors
//         socket.on('error', (errorMessage) => {
//             setError(errorMessage);
//             setIsLoading(false);
//         });

//         // Request initial rooms list
//         socket.emit('getRooms');

//         // Set up refresh interval for rooms
//         const interval = setInterval(() => {
//             socket.emit('getRooms');
//         }, 5000); // Refresh every 5 seconds

//         // Cleanup
//         return () => {
//             socket.off('availableRooms');
//             socket.off('error');
//             clearInterval(interval);
//         };
//     }, []);

//     const handleCreateGame = async () => {
//         if (!playerName.trim()) {
//             setError('Please enter your name');
//             return;
//         }

//         try {
//             setIsLoading(true);
//             setError('');
//             socket.emit('createGame', { playerName });
//         } catch (err) {
//             setError('Failed to create game');
//             setIsLoading(false);
//         }
//     };

//     const handleJoinGame = async (roomId = gameId) => {
//         if (!playerName.trim()) {
//             setError('Please enter your name');
//             return;
//         }

//         if (!roomId.trim()) {
//             setError('Please enter a game code');
//             return;
//         }

//         try {
//             setIsLoading(true);
//             setError('');
//             socket.emit('joinGame', { gameId: roomId, playerName });
//         } catch (err) {
//             setError('Failed to join game');
//             setIsLoading(false);
//         }
//     };

//     // Function to refresh room list manually
//     const handleRefreshRooms = () => {
//         socket.emit('getRooms');
//     };

//     return (
//         <div className="lobby-container">
//             <div className="lobby-content">
//                 <h1 className="lobby-title">Snake and Ladder</h1>
                
//                 {/* Error Display */}
//                 {error && (
//                     <div className="error-message">
//                         {error}
//                     </div>
//                 )}

//                 {/* Player Name Input */}
//                 <div className="input-group">
//                     <label htmlFor="playerName">Your Name</label>
//                     <input
//                         id="playerName"
//                         type="text"
//                         className="input-field"
//                         value={playerName}
//                         onChange={(e) => setPlayerName(e.target.value)}
//                         placeholder="Enter your name"
//                         disabled={isLoading}
//                     />
//                 </div>

//                 {/* Create Game Section */}
//                 <div className="create-game-section">
//                     <button 
//                         className="button primary-button"
//                         onClick={handleCreateGame}
//                         disabled={isLoading || !playerName.trim()}
//                     >
//                         {isLoading ? 'Creating...' : 'Create New Game'}
//                     </button>
//                 </div>

//                 {/* Available Rooms Section */}
//                 <div className="available-rooms-section">
//                     <div className="section-header">
//                         <h2>Available Games</h2>
//                         <button 
//                             className="refresh-button"
//                             onClick={handleRefreshRooms}
//                             disabled={isLoading}
//                         >
//                             Refresh
//                         </button>
//                     </div>

//                     <div className="rooms-list">
//                         {availableRooms.length === 0 ? (
//                             <div className="no-rooms">
//                                 No games available. Create one!
//                             </div>
//                         ) : (
//                             availableRooms.map((room) => (
//                                 <div key={room.id} className="room-card">
//                                     <div className="room-info">
//                                         <span className="room-id">Room: {room.id}</span>
//                                         <span className="player-count">
//                                             Players: {room.playerCount}/{room.maxPlayers}
//                                         </span>
//                                         <span className={`room-status ${room.status}`}>
//                                             {room.status}
//                                         </span>
//                                     </div>
//                                     <button
//                                         className="button secondary-button"
//                                         onClick={() => handleJoinGame(room.id)}
//                                         disabled={
//                                             isLoading || 
//                                             room.playerCount >= room.maxPlayers || 
//                                             !playerName.trim()
//                                         }
//                                     >
//                                         {room.playerCount >= room.maxPlayers 
//                                             ? 'Full' 
//                                             : 'Join Game'
//                                         }
//                                     </button>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>

//                 <div className="divider">
//                     <span>OR</span>
//                 </div>

//                 {/* Join by Code Section */}
//                 <div className="join-game-section">
//                     <div className="input-group">
//                         <label htmlFor="gameCode">Have a game code?</label>
//                         <input
//                             id="gameCode"
//                             type="text"
//                             className="input-field"
//                             value={gameId}
//                             onChange={(e) => setGameId(e.target.value)}
//                             placeholder="Enter game code"
//                             disabled={isLoading}
//                         />
//                     </div>
//                     <button 
//                         className="button secondary-button"
//                         onClick={() => handleJoinGame()}
//                         disabled={isLoading || !gameId.trim() || !playerName.trim()}
//                     >
//                         {isLoading ? 'Joining...' : 'Join Game'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default GameLobby;

import React, { useState, useEffect } from 'react';
import socket from '../service/socketService';

function GameLobby() {
    const [playerName, setPlayerName] = useState('');
    const [gameId, setGameId] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Listen for available rooms updates
        socket.on('availableRooms', (rooms) => {
            console.log('Received rooms:', rooms);
            setAvailableRooms(rooms);
        });

        // Listen for errors
        socket.on('error', (errorMessage) => {
            setError(errorMessage);
            setIsLoading(false);
        });

        // Request initial rooms list
        socket.emit('getRooms');

        // Set up refresh interval for rooms
        const interval = setInterval(() => {
            socket.emit('getRooms');
        }, 5000); // Refresh every 5 seconds

        // Cleanup
        return () => {
            socket.off('availableRooms');
            socket.off('error');
            clearInterval(interval);
        };
    }, []);

    const handleCreateGame = async () => {
        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            socket.emit('createGame', { playerName });
        } catch (err) {
            setError('Failed to create game');
            setIsLoading(false);
        }
    };

    const handleJoinGame = async (roomId = gameId) => {
        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!roomId.trim()) {
            setError('Please enter a game code');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            socket.emit('joinGame', { gameId: roomId, playerName });
        } catch (err) {
            setError('Failed to join game');
            setIsLoading(false);
        }
    };

    // Function to refresh room list manually
    const handleRefreshRooms = () => {
        socket.emit('getRooms');
    };

    return (
        <div className="lobby-container">
            <div className="lobby-content">
                <h1 className="lobby-title">Snake and Ladder</h1>
                
                {/* Error Display */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Player Name Input */}
                <div className="input-group">
                    <label htmlFor="playerName">Your Name</label>
                    <input
                        id="playerName"
                        type="text"
                        className="input-field"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        disabled={isLoading}
                    />
                </div>

                {/* Create Game Section */}
                <div className="create-game-section">
                    <button 
                        className="button primary-button"
                        onClick={handleCreateGame}
                        disabled={isLoading || !playerName.trim()}
                    >
                        {isLoading ? 'Creating...' : 'Create New Game'}
                    </button>
                </div>

                {/* Available Rooms Section */}
                <div className="available-rooms-section">
                    <div className="section-header">
                        <h2>Available Games</h2>
                        <button 
                            className="refresh-button"
                            onClick={handleRefreshRooms}
                            disabled={isLoading}
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="rooms-list">
                        {availableRooms.length === 0 ? (
                            <div className="no-rooms">
                                No games available. Create one!
                            </div>
                        ) : (
                            availableRooms.map((room) => (
                                <div key={room.id} className="room-card">
                                    <div className="room-info">
                                        <span className="room-id">Room: {room.id}</span>
                                        <span className="player-count">
                                            Players: {room.playerCount}/{room.maxPlayers}
                                        </span>
                                        <span className={`room-status ${room.status}`}>
                                            {room.status}
                                        </span>
                                    </div>
                                    <button
                                        className="button secondary-button"
                                        onClick={() => handleJoinGame(room.id)}
                                        disabled={
                                            isLoading || 
                                            room.playerCount >= room.maxPlayers || 
                                            !playerName.trim()
                                        }
                                    >
                                        {room.playerCount >= room.maxPlayers 
                                            ? 'Full' 
                                            : 'Join Game'
                                        }
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="divider">
                    <span>OR</span>
                </div>

                {/* Join by Code Section */}
                <div className="join-game-section">
                    <div className="input-group">
                        <label htmlFor="gameCode">Have a game code?</label>
                        <input
                            id="gameCode"
                            type="text"
                            className="input-field"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                            placeholder="Enter game code"
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        className="button secondary-button"
                        onClick={() => handleJoinGame()}
                        disabled={isLoading || !gameId.trim() || !playerName.trim()}
                    >
                        {isLoading ? 'Joining...' : 'Join Game'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameLobby;