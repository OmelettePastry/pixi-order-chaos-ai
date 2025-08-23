import type { Action } from "../types/action";
import type { Terminal } from "../types/terminal";
import { GameState } from "./game-state";
import { Mark } from "./mark";
import { Player } from "./player";

export class Game {

    private _cutoff: number;

    constructor();
    constructor(cutoff: number);

    constructor(cutoff?: number) {
        if (cutoff === undefined) {
            this._cutoff = 4;
        } else {
            this._cutoff = cutoff;
        }
    }


    actions(gameState: GameState): Action[] {
        const actionArray: Action[] = [];
        const board = gameState.boardCopy;

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === Mark._) {
                    actionArray.push({
                        row: row,
                        column: col,
                        mark: Mark.X
                    });
                    actionArray.push({
                        row: row,
                        column: col,
                        mark: Mark.O
                    });
                }
            }
        }

        return actionArray;
    }

    result(state: GameState, action: Action): GameState | null {
        const board = state.boardCopy;
        if(board[action.row][action.column] === Mark._) {
            board[action.row][action.column] = action.mark;
        } else {
            return null;
        }

        let nextPlayer = (state.playerTurn === Player.Order) ? Player.Chaos : Player.Order;

        return new GameState(board, nextPlayer, this.checkTerminal(board, action));
    }

    checkTerminal(board: Mark[][], action: Action): Terminal {
        const rows = board.length;
        const columns = board[0].length;
        const mark = action.mark;
        const r = action.row;
        const c = action.column;

        // Helper function to check for a winning line of 5 from a given position and direction.
        const checkLineForOrderWin = (startR: number, startC: number, dr: number, dc: number): boolean => {
            let count = 0;
            // Check both positive and negative directions from the starting point
            for (let i = -4; i <= 4; i++) {
                const nextR = startR + i * dr;
                const nextC = startC + i * dc;

                if (nextR >= 0 && nextR < rows && nextC >= 0 && nextC < columns && board[nextR][nextC] === mark) {
                    count++;
                    if (count >= 5) {
                        return true;
                    }
                } else {
                    // Reset count if the line is broken
                    count = 0;
                }
            }
            return false;
        };

        // --- Order Win Check  ---
        // Check the horizontal line passing through the last move
        if (checkLineForOrderWin(r, c, 0, 1)) {
            return { isTerminal: true, winner: Player.Order };
        }

        // Check the vertical line passing through the last move
        if (checkLineForOrderWin(r, c, 1, 0)) {
            return { isTerminal: true, winner: Player.Order };
        }

        // Check the main diagonal (top-left to bottom-right) passing through the last move
        if (checkLineForOrderWin(r, c, 1, 1)) {
            return { isTerminal: true, winner: Player.Order };
        }

        // Check the anti-diagonal (top-right to bottom-left) passing through the last move
        if (checkLineForOrderWin(r, c, 1, -1)) {
            return { isTerminal: true, winner: Player.Order };
        }

        // --- Chaos Win Check (Full Board Scan) ---
        // Check for a Chaos win by determining if any 5-in-a-row is still possible for Order.
        const hasPotentialWinningLine = (): boolean => {
            // Iterate through the entire board
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    // Check for potential lines starting from this position in all 4 directions.
                    // We only need to check forward from each cell.
                    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
                    for (const [dr, dc] of directions) {
                        let hasX = false;
                        let hasO = false;
                        let hasBlank = false;
                        let lineLength = 0;

                        // Check the line of 5 cells in this direction
                        for (let k = 0; k < 5; k++) {
                            const nextR = i + k * dr;
                            const nextC = j + k * dc;
                            
                            // Break if we go off the board
                            if (nextR < 0 || nextR >= rows || nextC < 0 || nextC >= columns) {
                                break;
                            }

                            lineLength++;
                            const currentMark = board[nextR][nextC];
                            if (currentMark === Mark.X) {
                                hasX = true;
                            } else if (currentMark === Mark.O) {
                                hasO = true;
                            } else {
                                hasBlank = true;
                            }
                        }

                        // A line is "potential" for an Order win if it's 5 cells long AND doesn't contain both 'X' and 'O'
                        if (lineLength === 5 && !(hasX && hasO)) {
                            return true; // Found a potential winning line for Order
                        }
                    }
                }
            }
            // If we get through all checks and find no potential lines, Chaos has won.
            return false;
        };

        if (!hasPotentialWinningLine()) {
            return { isTerminal: true, winner: Player.Chaos };
        }

        // No winner yet and potential lines still exist
        return { isTerminal: false, winner: null };
    }

    utility(state: GameState, player: Player): number {
        const terminalStatus = state.terminalStatusCopy;

        if (terminalStatus.winner === player) {
            return Infinity;
        } 
        
        if (terminalStatus.winner !== null && terminalStatus.winner !== player) {
            return -Infinity;
        }

        return 0;
    }

    isCutoff(depth: number) {
        return (this._cutoff === depth);
    }

    isTerminal(state: GameState): boolean {
        return state.terminalStatusCopy.isTerminal;
    }

    toMove(state: GameState): Player {
        return state.playerTurn;
    }
}