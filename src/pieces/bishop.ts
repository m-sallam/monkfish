import { Direction } from "../move.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { getSlidingAttacks, getSlidingMoves } from "./sliding.ts";

export const BishopDirections = [
  Direction.TOP_LEFT,
  Direction.TOP_RIGHT,
  Direction.BOTTOM_LEFT,
  Direction.BOTTOM_RIGHT,
];

export const getBishopPossibleMoves = (state: State, from: Square) => {
  const fileIndex = from % 8;

  const steps = {
    [Direction.TOP_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_LEFT]: fileIndex,
    [Direction.TOP_LEFT]: fileIndex,
  };

  return getSlidingMoves(state, from, BishopDirections, steps);
};

export const getBishopPossibleAttacks = (
  state: State,
  from: Square,
  attackedSquare?: Square,
) => {
  const fileIndex = from % 8;

  const steps = {
    [Direction.TOP_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_RIGHT]: 7 - fileIndex,
    [Direction.BOTTOM_LEFT]: fileIndex,
    [Direction.TOP_LEFT]: fileIndex,
  };

  return getSlidingAttacks(
    state,
    from,
    BishopDirections,
    steps,
    attackedSquare,
  );
};
