import { Direction, Move } from "../move.ts";
import { isColorAttackingSquare } from "../moves.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { oppositeColor } from "../utils.ts";
import { QueenDirections } from "./queen.ts";
import { getSlidingAttacks, getSlidingMoves } from "./sliding.ts";
import { BLACK_KING, WHITE_KING } from "./utils.ts";

export let cast = 0;
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

  const castles: Move[] = [];
  if (state.sideToMove === "w") {
    if (canWhiteKingCastle(state)) {
      cast++;
      castles.push({
        piece: WHITE_KING,
        from,
        to: (from + 2) as Square,
        promotion: null,
        castling: "K",
      });
    }
    if (canWhiteQueenCastle(state)) {
      cast++;
      castles.push({
        piece: WHITE_KING,
        from,
        to: (from - 2) as Square,
        promotion: null,
        castling: "Q",
      });
    }
  } else {
    if (canBlackKingCastle(state)) {
      cast++;
      castles.push({
        piece: BLACK_KING,
        from,
        to: (from + 2) as Square,
        promotion: null,
        castling: "K",
      });
    }
    if (canBlackQueenCastle(state)) {
      cast++;
      castles.push({
        piece: BLACK_KING,
        from,
        to: (from - 2) as Square,
        promotion: null,
        castling: "Q",
      });
    }
  }

  return getSlidingMoves(state, from, KingDirections, steps).concat(castles);
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

export const canCastleThroughPath = (
  state: State,
  path: Square[],
  castlingSquares: Square[],
) => {
  // castling squares includes the king square
  const isPathOccupied = path.some((square) => !!state.board[square]);
  if (isPathOccupied) return false;
  const isPathAttacked = castlingSquares.some((square) =>
    isColorAttackingSquare(
      oppositeColor(state.sideToMove),
      state,
      square,
    )
  );
  if (isPathAttacked) return false;

  return true;
};

export const canBlackQueenCastle = (state: State) => {
  if (!state.castling?.includes("q")) return false;
  return canCastleThroughPath(state, [57, 58, 59], [58, 59, 60]);
};

export const canBlackKingCastle = (state: State) => {
  if (!state.castling?.includes("k")) return false;
  return canCastleThroughPath(state, [61, 62], [60, 61, 62]);
};

export const canWhiteQueenCastle = (state: State) => {
  if (!state.castling?.includes("Q")) return false;
  return canCastleThroughPath(state, [1, 2, 3], [2, 3, 4]);
};

export const canWhiteKingCastle = (state: State) => {
  if (!state.castling?.includes("K")) return false;
  return canCastleThroughPath(state, [5, 6], [4, 5, 6]);
};
