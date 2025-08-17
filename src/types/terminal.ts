import type { Player } from "../models/player"

export type Terminal = {
    isTerminal: boolean,
    winner: Player | null
}