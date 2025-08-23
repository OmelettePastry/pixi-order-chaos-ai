import { WIN_LENGTH } from "../constants/game-constants";
import { SeriesValue } from "../constants/series-value-constant";
import type { GameState } from "../models/game-state";
import { Mark } from "../models/mark";
import { Player } from "../models/player";

export function orderHeuristic(state: GameState, player: Player): number {
    const board = state.boardCopy;
    const rows = board.length;
    const columns = board[0].length;
    let score = 0;

    // Determine the opponent's mark for scoring
    const opponentMark = player === Player.Order ? Mark.O : Mark.X;
    const playerMark = player === Player.Order ? Mark.X : Mark.O;

    /**
     * Helper function to get the heuristic value of a 5-cell line.
     * It returns a positive value for lines favoring the player, and a negative value for lines favoring the opponent.
     */
    const getLineValue = (line: Mark[]): number => {
        const hasPlayerMark = line.includes(playerMark);
        const hasOpponentMark = line.includes(opponentMark);

        // If the line is blocked by both players, it has no value.
        if (hasPlayerMark && hasOpponentMark) {
            return 0;
        }

        const maxPlayerConsecutive = getMaxConsecutiveNumber(line, playerMark);
        const maxOpponentConsecutive = getMaxConsecutiveNumber(line, opponentMark);
        
        // Return a positive score if the line favors the player
        if (hasPlayerMark) {
            return SeriesValue[maxPlayerConsecutive];
        }
        
        // Return a negative score if the line favors the opponent
        if (hasOpponentMark) {
            return -SeriesValue[maxOpponentConsecutive];
        }

        // If the line is empty, return 0.
        return 0;
    };

    const getMaxConsecutiveNumber = (line: Mark[], mark: Mark): number => {
        let maxConsecutiveCount: number = 0;
        let currentConsecutiveCount: number = 0;

        for (const element of line) {
            if (element === mark) {
                currentConsecutiveCount++;
            } else {
                // Only reset if the line is not a blank space
                if (element !== Mark._) {
                    currentConsecutiveCount = 0;
                }
            }
            maxConsecutiveCount = Math.max(maxConsecutiveCount, currentConsecutiveCount);
        }
        return maxConsecutiveCount;
    }
    
    // --- Iterate through all possible WIN_LENGTH-cell lines on the board ---
    // This is a comprehensive check that is not hardcoded to a specific board size.

    // Horizontal checks
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j <= columns - WIN_LENGTH; j++) {
            const line = board[i].slice(j, j + WIN_LENGTH);
            score += getLineValue(line);
        }
    }

    // Vertical checks
    for (let i = 0; i <= rows - WIN_LENGTH; i++) {
        for (let j = 0; j < columns; j++) {
            const line = [];
            for (let k = 0; k < WIN_LENGTH; k++) {
                line.push(board[i + k][j]);
            }
            score += getLineValue(line);
        }
    }
    
    // Main diagonal (top-left to bottom-right) checks
    for (let i = 0; i <= rows - WIN_LENGTH; i++) {
        for (let j = 0; j <= columns - WIN_LENGTH; j++) {
            const line = [];
            for (let k = 0; k < WIN_LENGTH; k++) {
                line.push(board[i + k][j + k]);
            }
            score += getLineValue(line);
        }
    }
    
    // Anti-diagonal (top-right to bottom-left) checks
    for (let i = 0; i <= rows - WIN_LENGTH; i++) {
        for (let j = WIN_LENGTH - 1; j < columns; j++) {
            const line = [];
            for (let k = 0; k < WIN_LENGTH; k++) {
                line.push(board[i + k][j - k]);
            }
            score += getLineValue(line);
        }
    }

    return score;
}