import { Direction } from "../move.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { QueenDirections } from "./queen.ts";
import { getSlidingAttacks, getSlidingMoves } from "./sliding.ts";

export const KingDirections = [...QueenDirections];

export const getKingPossibleMoves = (state: State, from: Square) => {
  const fileIndex = from % 8;
  const rankIndex = Math.floor(from / 8);

  const steps = {
    [Direction.TOP]: rankIndex === 7 ? 0 : 1,
    [Direction.RIGHT]: fileIndex === 7 ? 0 : 1,
    [Direction.BOTTOM]: rankIndex === 0 ? 0 : 1,
    [Direction.LEFT]: fileIndex === 0 ? 0 : 1,
    [Direction.TOP_RIGHT]: fileIndex === 7 || rankIndex === 7 ? 0 : 1,
    [Direction.BOTTOM_RIGHT]: fileIndex === 7 || rankIndex === 0 ? 0 : 1,
    [Direction.BOTTOM_LEFT]: fileIndex === 0 || rankIndex === 0 ? 0 : 1,
    [Direction.TOP_LEFT]: fileIndex === 0 || rankIndex === 7 ? 0 : 1,
  };

  return getSlidingMoves(state, from, KingDirections, steps);
};

export const getKingPossibleAttacks = (
  state: State,
  from: Square,
  attackedSquare?: Square,
) => {
  const fileIndex = from % 8;
  const rankIndex = Math.floor(from / 8);

  const steps = {
    [Direction.TOP]: rankIndex === 7 ? 0 : 1,
    [Direction.RIGHT]: fileIndex === 7 ? 0 : 1,
    [Direction.BOTTOM]: rankIndex === 0 ? 0 : 1,
    [Direction.LEFT]: fileIndex === 0 ? 0 : 1,
    [Direction.TOP_RIGHT]: fileIndex === 7 || rankIndex === 7 ? 0 : 1,
    [Direction.BOTTOM_RIGHT]: fileIndex === 7 || rankIndex === 0 ? 0 : 1,
    [Direction.BOTTOM_LEFT]: fileIndex === 0 || rankIndex === 0 ? 0 : 1,
    [Direction.TOP_LEFT]: fileIndex === 0 || rankIndex === 7 ? 0 : 1,
  };

  return getSlidingAttacks(state, from, KingDirections, steps, attackedSquare);
};
