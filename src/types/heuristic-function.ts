import type { GameState } from "../models/game-state";
import type { Player } from "../models/player";

export type HeuristicFunction = (state: GameState, player: Player) => number;