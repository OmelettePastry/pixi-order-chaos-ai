import { Game } from "../models/game";
import { GameState } from "../models/game-state";
import { Player } from "../models/player";
import type { Action } from "../types/action";
import type { HeuristicFunction } from "../types/heuristic-function";
import type { MoveValue } from "../types/move-value";

export class AlphaBetaSearch {

    private heuristic: HeuristicFunction;

    constructor(heuristic: HeuristicFunction) {
        this.heuristic = heuristic;
    }

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
            return { value: this.heuristic(state, player), move: null };
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
            return { value: this.heuristic(state, player), move: null };
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
}