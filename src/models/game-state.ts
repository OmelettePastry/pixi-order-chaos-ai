import { DEFAULT_BOARD_SIZE } from "../constants/game-constants";
import type { Terminal } from "../types/terminal";
import { Mark } from "./mark";
import { Player } from "./player";

export class GameState {
    private _board: Mark[][];
    private _playerTurn: Player;
    private _terminalStatus: Terminal;

    constructor();
    constructor(board: Mark[][], playerTurn: Player);
    constructor(board: Mark[][], playerTurn: Player, terminalStatus: Terminal);

    constructor(board?: Mark[][], playerTurn?: Player, terminalStatus?: Terminal) {
        // If no board is provided, create a new 6x6 board, otherwise deep copy the provided board.
        this._board = board?.map(row => [...row]) ?? Array(6).fill(0).map(() => Array(6).fill(Mark._));

        // If no player turn is provided, default to Player.Order.
        this._playerTurn = playerTurn ?? Player.Order;

        // If no terminal status is provided, create a new non-terminal status, otherwise deep copy the provided status.
        this._terminalStatus = terminalStatus
            ? { isTerminal: terminalStatus.isTerminal, winner: terminalStatus.winner }
            : { isTerminal: false, winner: null };
    }

    get boardCopy(): Mark[][] {
        return this._board.map((innerArray) => [...innerArray]);
    }

    get playerTurn(): Player {
        return this._playerTurn;
    }

    get terminalStatusCopy(): Terminal {
        return { ...this._terminalStatus};
    }
}