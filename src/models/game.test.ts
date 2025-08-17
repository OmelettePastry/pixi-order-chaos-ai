import { describe, expect, it } from "vitest";
import { Game } from "./game";
import { Mark } from "./mark";
import type { Action } from "../types/action";
import { GameState } from "./game-state";
import { Player } from "./player";
import type { Terminal } from "../types/terminal";

describe('Game test', () => {
    // it('checkTerminal - test 1', () => {
    //     const game: Game = new Game();
    //     const board: Mark[][] = [
    //         [Mark.X, Mark.X, Mark.X, Mark.O, Mark.O, Mark.O],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.O, Mark.O],
    //         [Mark.O, Mark.O, Mark.X, Mark.X, Mark.X, Mark.X],
    //         [Mark.X, Mark.O, Mark.X, Mark.X, Mark.X, Mark.O],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.X, Mark.O],
    //         [Mark.X, Mark.O, Mark.X, Mark.X, Mark.X, Mark.X],
    //     ];
    //     const gameState: GameState = new GameState(board, Player.Order);
    //     const action: Action = {
    //         row: 5,
    //         column: 0,
    //         mark: Mark.X
    //     };

    //     const terminalStatus = game.checkTerminal(gameState, action);
    //     const expectedTerminalStatus: Terminal = {
    //         isTerminal: true,
    //         winner: Player.Chaos
    //     };

    //     expect(terminalStatus).toEqual(expectedTerminalStatus);
    // });

    // it('checkTerminalExped - test 1', () => {
    //     const game: Game = new Game();
    //     const board: Mark[][] = [
    //         [Mark.X, Mark.X, Mark.X, Mark.X, Mark.O, Mark.X],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.O, Mark.O],
    //         [Mark.O, Mark.O, Mark.O, Mark.X, Mark.X, Mark.X],
    //         [Mark.O, Mark.X, Mark.X, Mark.X, Mark.X, Mark.O],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.X, Mark.O],
    //         [Mark.O, Mark.O, Mark.X, Mark.X, Mark.X, Mark.X],
    //     ];
    //     const gameState: GameState = new GameState(board, Player.Order);
    //     const action: Action = {
    //         row: 1,
    //         column: 0,
    //         mark: Mark.O
    //     };

    //     const terminalStatus = game.checkTerminalExped(gameState, action);
    //     const expectedTerminalStatus: Terminal = {
    //         isTerminal: true,
    //         winner: Player.Order
    //     };

    //     expect(terminalStatus).toEqual(expectedTerminalStatus);
    // });

    // it('result - test 1', () => {
    //     const game: Game = new Game();
    //     const board: Mark[][] = [
    //         [Mark.X, Mark.X, Mark.X, Mark.X, Mark.O, Mark.X],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.O, Mark.O],
    //         [Mark.O, Mark.O, Mark.O, Mark.X, Mark.X, Mark.X],
    //         [Mark._, Mark.X, Mark.X, Mark._, Mark.X, Mark.O],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.X, Mark.O],
    //         [Mark.X, Mark.O, Mark.X, Mark.X, Mark.X, Mark.X],
    //     ];
        
    //     const gameState: GameState = new GameState(board, Player.Order);
    //     const action: Action = {
    //         row: 3,
    //         column: 0,
    //         mark: Mark.O
    //     };

    //     const result = game.result(gameState, action);

    //     const newBoard: Mark[][] = [
    //         [Mark.X, Mark.X, Mark.X, Mark.X, Mark.O, Mark.X],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.O, Mark.O],
    //         [Mark.O, Mark.O, Mark.O, Mark.X, Mark.X, Mark.X],
    //         [Mark.O, Mark.X, Mark.X, Mark._, Mark.X, Mark.O],
    //         [Mark.O, Mark.X, Mark.O, Mark.O, Mark.X, Mark.O],
    //         [Mark.X, Mark.O, Mark.X, Mark.X, Mark.X, Mark.X],
    //     ];
    //     const expectedResultState = new GameState(newBoard,
    //         Player.Chaos,
    //         { isTerminal: false, winner: null});

    //     expect(result).toEqual(expectedResultState);
    // })
    it("should place mark in empty cell and switch turn", () => {
        const game = new Game();
        const state = new GameState();
        const action = { row: 0, column: 0, mark: Mark.X };
        const newState = game.result(state, action);

        expect(newState).not.toBeNull();
        expect(newState!.boardCopy[0][0]).toBe(Mark.X);
        expect(newState!.playerTurn).toBe(Player.Chaos); // Order → Chaos
        expect(newState!.terminalStatusCopy.isTerminal).toBe(false);
    });

    it("should return undefined if the cell is already occupied", () => {
        const game = new Game();
        const board = Array(6).fill(0).map(() => Array(6).fill(Mark._));
        board[0][0] = Mark.X;
        const state = new GameState(board, Player.Order);

        const action = { row: 0, column: 0, mark: Mark.O };
        const newState = game.result(state, action);

        expect(newState).toBeNull();
    });

    it("should detect Order win when move makes 5 in a row horizontally", () => {
        const game = new Game();
        const board = Array(6).fill(0).map(() => Array(6).fill(Mark._));
        board[0][0] = Mark.X;
        board[0][1] = Mark.X;
        board[0][2] = Mark.X;
        board[0][3] = Mark.X;
        const state = new GameState(board, Player.Order);

        const action = { row: 0, column: 4, mark: Mark.X };
        const newState = game.result(state, action);

        expect(newState).not.toBeNull();
        expect(newState!.terminalStatusCopy.isTerminal).toBe(true);
        expect(newState!.terminalStatusCopy.winner).toBe(Player.Order);
    });

    it("should detect Order win diagonally (top-left to bottom-right)", () => {
        const game = new Game();        
        const board = Array(6).fill(0).map(() => Array(6).fill(Mark._));
        board[0][0] = Mark.X;
        board[1][1] = Mark.X;
        board[2][2] = Mark.X;
        board[3][3] = Mark.X;
        const state = new GameState(board, Player.Order);

        const action = { row: 4, column: 4, mark: Mark.X };
        const newState = game.result(state, action);

        expect(newState).not.toBeNull();
        expect(newState!.terminalStatusCopy.isTerminal).toBe(true);
        expect(newState!.terminalStatusCopy.winner).toBe(Player.Order);
    });

    it("should detect Order win diagonally (top-right to bottom-left)", () => {
        const game = new Game();        
        const board = Array(6).fill(0).map(() => Array(6).fill(Mark._));
        board[0][4] = Mark.X;
        board[1][3] = Mark.X;
        board[2][2] = Mark.X;
        board[3][1] = Mark.X;
        const state = new GameState(board, Player.Order);

        const action = { row: 4, column: 0, mark: Mark.X };
        const newState = game.result(state, action);

        expect(newState).not.toBeNull();
        expect(newState!.terminalStatusCopy.isTerminal).toBe(true);
        expect(newState!.terminalStatusCopy.winner).toBe(Player.Order);
    });    

    it("should detect Chaos win when board is full without 5 in a row", () => {
        const game = new Game();
        // Fill the board alternating X and O, no 5-in-a-row
        const board = Array(6).fill(0).map(() => Array(6).fill(Mark.X));
        for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            board[r][c] = (r + c) % 2 === 0 ? Mark.X : Mark.O;
        }
        }
        board[5][5] = Mark._; // leave one empty
        const state = new GameState(board, Player.Order);

        const action = { row: 5, column: 5, mark: Mark.O };
        const newState = game.result(state, action);

        expect(newState).not.toBeNull();
        expect(newState!.terminalStatusCopy.isTerminal).toBe(true);
        expect(newState!.terminalStatusCopy.winner).toBe(Player.Chaos);
    });    

    it("should not mutate original GameState on invalid move", () => {
        const game = new Game();
        const board = Array(6).fill(0).map(() => Array(6).fill(Mark._));
        board[2][3] = Mark.O; // already occupied

        const state = new GameState(board, Player.Order);
        const originalBoardCopy = state.boardCopy; // snapshot before move

        const action = { row: 2, column: 3, mark: Mark.X };
        const newState = game.result(state, action);

        // 1. Should be invalid
        expect(newState).toBeNull();

        // 2. Original GameState board remains unchanged
        expect(state.boardCopy).toEqual(originalBoardCopy);
    });    
})