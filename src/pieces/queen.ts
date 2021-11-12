import { Direction } from "../move.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { BishopDirections } from "./bishop.ts";
import { RookDirections } from "./rook.ts";
import { getSlidingAttacks, getSlidingMoves } from "./sliding.ts";

export const QueenDirections = [...RookDirections, ...BishopDirections];

export const getQueenPossibleMoves = (state: State, from: Square) => {
  const fileIndex = from % 8;
  const rankIndex = Math.floor(from / 8);

  const steps = {
    [Direction.TOP]: 7 - rankIndex,
    [Direction.RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM]: rankIndex,
    [Direction.LEFT]: fileIndex,
    [Direction.TOP_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_LEFT]: fileIndex,
    [Direction.TOP_LEFT]: fileIndex,
  };

  return getSlidingMoves(state, from, QueenDirections, steps);
};

export const getQueenPossibleAttacks = (
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
    [Direction.TOP_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_LEFT]: fileIndex,
    [Direction.TOP_LEFT]: fileIndex,
  };

  return getSlidingAttacks(state, from, QueenDirections, steps, attackedSquare);
};
