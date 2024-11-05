
import React, { useState, useEffect } from 'react';
import socket from './services/socketService';
import './game.css';
import ChatBox from './components/ChatBox';

function App() {
    const [playerName, setPlayerName] = useState('');
    const [gameId, setGameId] = useState('');
    const [gameState, setGameState] = useState(null);
    const [player, setPlayer] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [diceValue, setDiceValue] = useState(null);
    const [isRolling, setIsRolling] = useState(false);

    useEffect(() => {
        function handleGameCreated(data) {
            console.log('Game created:', data);
            if (data) {
                setGameState(data);
                setPlayer({
                    id: socket.id,
                    name: playerName,
                    position: 1
                });
                setError('');
                setIsLoading(false);
            }
        }

        function handleGameState(state) {
            console.log('Game state updated:', state);
            if (state) {
                setGameState(state);
                if (!player && state.players) {
                    const currentPlayer = state.players.find(p => p.id === socket.id);
                    if (currentPlayer) {
                        setPlayer(currentPlayer);
                    }
                }
            }
        }

        function handleError(errorMsg) {
            console.error('Game error:', errorMsg);
            setError(errorMsg);
            setIsLoading(false);
        }

        function handleAvailableRooms(rooms) {
            console.log('Available rooms:', rooms);
            setAvailableRooms(rooms || []);
        }

        // Set up socket listeners
        socket.on('gameCreated', handleGameCreated);
        socket.on('gameState', handleGameState);
        socket.on('error', handleError);
        socket.on('availableRooms', handleAvailableRooms);

        // Request available rooms
        socket.emit('getRooms');

        // Cleanup
        return () => {
            socket.off('gameCreated', handleGameCreated);
            socket.off('gameState', handleGameState);
            socket.off('error', handleError);
            socket.off('availableRooms', handleAvailableRooms);
        };
    }, [player, playerName]);

    const handleCreateGame = () => {
        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }
        
        try {
            setIsLoading(true);
            setError('');
            console.log('Creating game for player:', playerName);
            socket.emit('createGame', { playerName: playerName.trim() });
        } catch (err) {
            console.error('Error creating game:', err);
            setError('Failed to create game');
            setIsLoading(false);
        }
    };

    const handleJoinGame = (roomId = gameId) => {
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
            console.log('Joining game:', roomId, 'as player:', playerName);
            socket.emit('joinGame', { gameId: roomId, playerName: playerName.trim() });
        } catch (err) {
            console.error('Error joining game:', err);
            setError('Failed to join game');
            setIsLoading(false);
        }
    };

    const handleRollDice = () => {
        if (!gameState || !player || isRolling || gameState.currentPlayer !== player.id) return;
        
        setIsRolling(true);
        const roll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(roll);

        socket.emit('rollDice', { 
            gameId: gameState.id,
            playerId: player.id,
            diceValue: roll 
        });

        setTimeout(() => {
            setIsRolling(false);
        }, 1000);
    };

    const createBoard = () => {
        const board = [];
        for (let i = 10; i >= 1; i--) {
            const row = [];
            const start = i * 10;
            
            if (i % 2 === 0) {
                for (let j = start - 9; j <= start; j++) {
                    row.push(j);
                }
            } else {
                for (let j = start; j > start - 10; j--) {
                    row.push(j);
                }
            }
            board.push(row);
        }
        return board;
    };

    // Render lobby screen
    if (!gameState) {
        return (
            <div className="lobby-screen">
                <h1>Snake and Ladder</h1>
                {error && <div className="error">{error}</div>}
                
                <div className="input-section">
                    <input
                        type="text"
                        className="input-field"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter your name"
                        disabled={isLoading}
                    />
                    <button 
                        className="button primary-button"
                        onClick={handleCreateGame}
                        disabled={isLoading || !playerName.trim()}
                    >
                        {isLoading ? 'Creating...' : 'Create New Game'}
                    </button>
                </div>

                {availableRooms.length > 0 && (
                    <>
                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div className="available-rooms">
                            <h3>Available Rooms</h3>
                            <div className="rooms-list">
                                {availableRooms.map((room) => (
                                    <div key={room.id} className="room-card">
                                        <div className="room-info">
                                            <span>Room: {room.id}</span>
                                            <span>Players: {room.playerCount}/{room.maxPlayers}</span>
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
                                            {room.playerCount >= room.maxPlayers ? 'Full' : 'Join Game'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="join-section">
                    <input
                        type="text"
                        className="input-field"
                        value={gameId}
                        onChange={(e) => setGameId(e.target.value)}
                        placeholder="Enter game code"
                        disabled={isLoading}
                    />
                    <button 
                        className="button secondary-button"
                        onClick={() => handleJoinGame()}
                        disabled={isLoading || !gameId.trim() || !playerName.trim()}
                    >
                        {isLoading ? 'Joining...' : 'Join Game'}
                    </button>
                </div>
            </div>
        );
    }

    // Render game board
    return (
        <div className="game-container">
            <div className="game-layout">
            <div className="game-main">
            <div className="game-info">
                <h2>Game Code: <span className="game-code">{gameState.id}</span></h2>
                {error && <div className="error">{error}</div>}
                <div className="turn-info">
                    {player && gameState.currentPlayer === player.id ? 
                        "Your turn!" : 
                        "Waiting for other player..."
                    }
                </div>
                {diceValue && (
                    <div className="dice-value">
                        Dice Roll: {diceValue}
                    </div>
                )}
            </div>

            <div className="game-board">
                {createBoard().map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {row.map((cell) => (
                            <div
                                key={cell}
                                className={`cell ${
                                    gameState.snakesAndLadders && gameState.snakesAndLadders[cell] > cell ? 'ladder' :
                                    gameState.snakesAndLadders && gameState.snakesAndLadders[cell] < cell ? 'snake' : ''
                                }`}
                            >
                                {cell}
                                {gameState.players && gameState.players.map((p) => 
                                    p && p.position === cell && (
                                        <div
                                            key={p.id}
                                            className={`player-token ${p.id === player?.id ? 'p1' : 'p2'}`}
                                            title={p.name}
                                        />
                                    )
                                )}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            <div className="dice-controls">
                <button
                    className="dice-button"
                    onClick={handleRollDice}
                    disabled={isRolling || !player || !gameState || gameState.currentPlayer !== player.id}
                >
                    {isRolling ? 'Rolling...' : 'Roll Dice'}
                </button>
            </div>
            </div>
            <div className="game-sidebar">
            <div className="players-list">
                <h3>Players:</h3>
                {gameState.players && gameState.players.map((p) => (
                    p && (
                        <div 
                            key={p.id} 
                            className={`player ${p.id === gameState.currentPlayer ? 'current' : ''}`}
                        >
                            {p.name} (Position: {p.position})
                            {p.id === gameState.currentPlayer && ' - Current Turn'}
                        </div>
                    )
                ))}
            </div>
            <ChatBox 
                    socket={socket}
                    gameId={gameState.id}
                    playerName={player?.name || ''}
                />
        </div>
        </div>
        </div>
    );
}

export default App;
