import { WIN_LENGTH } from "../constants/game-constants";
import { SeriesValue } from "../constants/series-value-constant";
import { Game } from "../models/game";
import { GameState } from "../models/game-state";
import { Mark } from "../models/mark";
import { Player } from "../models/player";
import type { Action } from "../types/action";
import type { MoveValue } from "../types/move-value";

export class AgentOne {


    constructor() {}

    alphaBetaSearch (game: Game, state: GameState): Action {
        const depth = 0;
        const player = game.toMove(state);
        const moveValue: { [key: string]: any } = this.maxValue(game, state, player, depth + 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        return moveValue['move'];
    }

    private maxValue(game: Game, state: GameState, player: Player, depth: number, alpha: number, beta: number): MoveValue {
        // Terminal state -> return utility
        if (game.isTerminal(state)) {
            return { value: game.utility(state, player), move: null };
        }

        // Depth cutoff -> use evaluation function
        if (game.isCutoff(depth)) {
            return { value: this.evaluation(state, player), move: null };
        }

        let ourMoveValue: MoveValue = { value: Number.NEGATIVE_INFINITY, move: null };

        for (const action of game.actions(state)) {
            const nextState = game.result(state, action);
            if (!nextState) continue; // skip invalid moves

            const eachMoveValue = this.minValue(game, nextState, player, depth + 1, alpha, beta);
            
            // Update ourMoveValue if the current move is better
            if (eachMoveValue.value > ourMoveValue.value) {
                ourMoveValue = { value: eachMoveValue.value, move: action };
            }

            // Update alpha and check for pruning
            alpha = Math.max(alpha, ourMoveValue.value);
            if (alpha >= beta) {
                return ourMoveValue; // Prune
            }
        }

        return ourMoveValue;
    }

    private minValue(game: Game, state: GameState, player: Player, depth: number, alpha: number, beta: number): MoveValue {
        // Terminal state -> return utility
        if (game.isTerminal(state)) {
            return { value: game.utility(state, player), move: null };
        }

        // Depth cutoff -> use evaluation function
        if (game.isCutoff(depth)) {
            return { value: this.evaluation(state, player), move: null };
        }

        let ourMoveValue: MoveValue = { value: Number.POSITIVE_INFINITY, move: null };

        for (const action of game.actions(state)) {
            const nextState = game.result(state, action);
            if (!nextState) continue; // skip invalid moves

            const eachMoveValue = this.maxValue(game, nextState, player, depth + 1, alpha, beta);

            // Update ourMoveValue if the current move is better
            if (eachMoveValue.value < ourMoveValue.value) {
                ourMoveValue = { value: eachMoveValue.value, move: action };
            }

            // Update beta and check for pruning
            beta = Math.min(beta, ourMoveValue.value);
            if (beta <= alpha) {
                return ourMoveValue; // Prune
            }
        }

        return ourMoveValue;
    }

    // Heuristic evaluation function
    evaluation(state: GameState, player: Player): number {
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

            const maxPlayerConsecutive = this.getMaxConsecutiveNumber(line, playerMark);
            const maxOpponentConsecutive = this.getMaxConsecutiveNumber(line, opponentMark);
            
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

    private getMaxConsecutiveNumber(line: Mark[], mark: Mark): number {
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
}