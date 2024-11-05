

// import React from 'react';

// function GameBoard({ gameState, onRollDice, isRolling, playerId }) {
//     const createBoard = () => {
//         const board = [];
//         for (let i = 10; i >= 1; i--) {
//             const row = [];
//             const start = i * 10;
//             if (i % 2 === 0) {
//                 for (let j = start - 9; j <= start; j++) {
//                     row.push(j);
//                 }
//             } else {
//                 for (let j = start; j > start - 10; j--) {
//                     row.push(j);
//                 }
//             }
//             board.push(row);
//         }
//         return board;
//     };

//     return (
//         <div className="game-board">
//             {createBoard().map((row, rowIndex) => (
//                 <div key={rowIndex} className="board-row">
//                     {row.map(cell => (
//                         <div 
//                             key={cell}
//                             className={`cell ${
//                                 gameState.snakesAndLadders[cell] > cell ? 'ladder' :
//                                 gameState.snakesAndLadders[cell] < cell ? 'snake' : ''
//                             }`}
//                         >
//                             {cell}
//                             {gameState.players.map(player => 
//                                 player.position === cell && (
//                                     <div
//                                         key={player.id}
//                                         className={`player-token ${player.id === playerId ? 'current' : ''}`}
//                                         title={player.name}
//                                     />
//                                 )
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             ))}
//             <button
//                 className="dice-button"
//                 onClick={onRollDice}
//                 disabled={isRolling || gameState.currentPlayer !== playerId}
//             >
//                 {isRolling ? 'Rolling...' : 'Roll Dice'}
//             </button>
//         </div>
//     );
// }

// export default GameBoard;

import React from 'react';

function GameBoard({ gameState, onRollDice, isRolling, playerId }) {
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

    return (
        <div className="game-board">
            {createBoard().map((row, rowIndex) => (
                <div key={rowIndex} className="board-row">
                    {row.map(cell => (
                        <div 
                            key={cell}
                            className={`cell ${
                                gameState.snakesAndLadders[cell] > cell ? 'ladder' :
                                gameState.snakesAndLadders[cell] < cell ? 'snake' : ''
                            }`}
                        >
                            {cell}
                            {gameState.players.map(player => 
                                player.position === cell && (
                                    <div
                                        key={player.id}
                                        className={`player-token ${player.id === playerId ? 'current' : ''}`}
                                        title={player.name}
                                    />
                                )
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <button
                className="dice-button"
                onClick={onRollDice}
                disabled={isRolling || gameState.currentPlayer !== playerId}
            >
                {isRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
        </div>
    );
}

export default GameBoard;
