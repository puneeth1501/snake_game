class Game {
    constructor(id) {
        this.id = id;
        this.players = [];
        this.currentPlayer = null;
        this.status = 'waiting'; // waiting, playing, ended
        this.messages = [];
        this.createdAt = new Date();
    }

    static get RULES() {
        return {
            MAX_PLAYERS: 4,
            SNAKES_AND_LADDERS: {
                // Ladders
                4: 14,
                9: 31,
                21: 42,
                28: 84,
                51: 67,
                // Snakes
                17: 7,
                62: 19,
                64: 60,
                87: 24,
                93: 73,
                95: 75,
                99: 78
            }
        };
    }

    addPlayer(player) {
        if (this.players.length >= Game.RULES.MAX_PLAYERS) {
            return false;
        }

        this.players.push({ ...player, position: 1 });

        // First player becomes current player
        if (this.players.length === 1) {
            this.currentPlayer = player.id;
        }

        // Game starts with 2 or more players
        if (this.players.length >= 2) {
            this.status = 'playing';
        }

        return true;
    }

    removePlayer(playerId) {
        const index = this.players.findIndex(p => p.id === playerId);
        if (index === -1) return false;

        this.players.splice(index, 1);

        // Update game status if not enough players
        if (this.players.length < 2) {
            this.status = 'waiting';
        }

        // Update current player if needed
        if (this.currentPlayer === playerId && this.players.length > 0) {
            this.currentPlayer = this.players[0].id;
        }

        return true;
    }

    makeMove(playerId, diceValue) {
        if (this.status !== 'playing' || this.currentPlayer !== playerId) {
            return { success: false, message: 'Invalid turn' };
        }

        const player = this.players.find(p => p.id === playerId);
        if (!player) return { success: false, message: 'Player not found' };

        let newPosition = player.position + diceValue;

        // Check if exceeding 100
        if (newPosition > 100) {
            return { 
                success: false, 
                message: 'Need exact number to reach 100',
                currentPosition: player.position
            };
        }

        // Check for snakes and ladders
        const finalPosition = Game.RULES.SNAKES_AND_LADDERS[newPosition] || newPosition;

        // Update player position
        player.position = finalPosition;

        // Check for win
        if (finalPosition === 100) {
            this.status = 'ended';
            return { 
                success: true, 
                message: 'win',
                newPosition: finalPosition,
                specialMove: newPosition !== finalPosition
            };
        }

        // Move to next player
        const currentPlayerIndex = this.players.findIndex(p => p.id === playerId);
        this.currentPlayer = this.players[(currentPlayerIndex + 1) % this.players.length].id;

        return { 
            success: true,
            newPosition: finalPosition,
            specialMove: newPosition !== finalPosition
        };
    }

    addMessage(message) {
        this.messages.push({
            ...message,
            timestamp: new Date()
        });
        if (this.messages.length > 50) {
            this.messages.shift();
        }
    }

    getState() {
        return {
            id: this.id,
            players: this.players,
            currentPlayer: this.currentPlayer,
            status: this.status,
            messages: this.messages,
            snakesAndLadders: Game.RULES.SNAKES_AND_LADDERS
        };
    }

    getPublicState() {
        return {
            id: this.id,
            playerCount: this.players.length,
            maxPlayers: Game.RULES.MAX_PLAYERS,
            status: this.status
        };
    }
}

module.exports = Game;
