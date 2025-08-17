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
        if (board === undefined) {
            this._board = Array(6).fill(0).map(() => Array(6).fill(Mark._));
        } else {
            this._board = board.map(row => [...row]);
        }

        if (playerTurn === undefined) {
            this._playerTurn = Player.Order;
        } else {
            this._playerTurn = playerTurn;
        }

        if (terminalStatus === undefined) {
            this._terminalStatus = {
                isTerminal: false,
                winner: null
            };
        } else {
            this._terminalStatus = {
                isTerminal: terminalStatus.isTerminal,
                winner: terminalStatus.winner
            };
        }
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