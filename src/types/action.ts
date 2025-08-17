import type { Mark } from "../models/mark";

export type Action = {
    row: number,
    column: number,
    mark: Mark
}