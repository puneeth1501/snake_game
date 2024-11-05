// import React from 'react';

// function PlayerList({ players, currentPlayer }) {
//     return (
//         <div className="player-list">
//             <h3>Players</h3>
//             {players.map(player => (
//                 <div 
//                     key={player.id}
//                     className={`player-item ${player.id === currentPlayer ? 'active' : ''}`}
//                 >
//                     {player.name}
//                     {player.id === currentPlayer && ' (Current Turn)'}
//                 </div>
//             ))}
//         </div>
//     );
// }

// export default PlayerList;
import React from 'react';

function PlayerList({ players, currentPlayer }) {
    return (
        <div className="player-list">
            <h3>Players</h3>
            {players.map(player => (
                <div 
                    key={player.id}
                    className={`player-item ${player.id === currentPlayer ? 'active' : ''}`}
                >
                    {player.name}
                    {player.id === currentPlayer && ' (Current Turn)'}
                </div>
            ))}
        </div>
    );
}

export default PlayerList;

