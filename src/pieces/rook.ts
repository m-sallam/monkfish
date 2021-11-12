import { Direction } from "../move.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { getSlidingAttacks, getSlidingMoves } from "./sliding.ts";

export const RookDirections = [
  Direction.TOP,
  Direction.BOTTOM,
  Direction.RIGHT,
  Direction.LEFT,
];

export const getRookPossibleMoves = (state: State, from: Square) => {
  const fileIndex = from % 8;
  const rankIndex = Math.floor(from / 8);

  const steps = {
    [Direction.TOP]: 7 - rankIndex,
    [Direction.RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM]: rankIndex,
    [Direction.LEFT]: fileIndex,
  };

  return getSlidingMoves(state, from, RookDirections, steps);
};

export const getRookPossibleAttacks = (
  state: State,
  from: Square,
  attackedSquare?: Square,
) => {
  const fileIndex = from % 8;
  const rankIndex = Math.floor(from / 8);

  const steps = {
    [Direction.TOP]: 7 - rankIndex,
    [Direction.RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM]: rankIndex,
    [Direction.LEFT]: fileIndex,
  };

  return getSlidingAttacks(state, from, RookDirections, steps, attackedSquare);
};
