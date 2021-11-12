import { Direction, Move } from "../move.ts";
import { Piece } from "./utils.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { isValidSquare } from "../utils.ts";

export const getSlidingMoves = (
  state: State,
  from: Square,
  directions: Direction[],
  steps: Partial<Record<Direction, number>>,
) => {
  const isWhiteToMove = state.sideToMove === "w";
  const canTake = (piece: Piece) => {
    return isWhiteToMove ? piece < 0 : piece > 0;
  };

  const piece = state.board[from];

  const moves: Move[] = [];
  for (const direction of directions) {
    for (let step = 0; step < (steps[direction] ?? 0); step++) {
      let position = 0;
      if (direction === Direction.TOP) {
        position = from + (step + 1) * 8;
      } else if (direction === Direction.RIGHT) {
        position = from + (step + 1) * 1;
      } else if (direction === Direction.BOTTOM) {
        position = from - (step + 1) * 8;
      } else if (direction === Direction.LEFT) {
        position = from - (step + 1) * 1;
      } else if (direction === Direction.TOP_LEFT) {
        position = from + (step + 1) * 7;
      } else if (direction === Direction.TOP_RIGHT) {
        position = from + (step + 1) * 9;
      } else if (direction === Direction.BOTTOM_RIGHT) {
        position = from - (step + 1) * 7;
      } else if (direction === Direction.BOTTOM_LEFT) {
        position = from - (step + 1) * 9;
      }

      if (isValidSquare(position)) {
        const pieceOnPosition = state.board[position];
        if (pieceOnPosition) {
          if (canTake(pieceOnPosition)) {
            moves.push({
              piece: piece as Piece,
              from,
              to: position,
              promotion: null,
              castling: null,
            });
          }
          break;
        } else {
          moves.push({
            piece: piece as Piece,
            from,
            to: position,
            promotion: null,
            castling: null,
          });
        }
      } else break;
    }
  }

  return moves;
};

export const getSlidingAttacks = (
  state: State,
  from: Square,
  directions: Direction[],
  steps: Partial<Record<Direction, number>>,
  attackedSquare?: Square,
) => {
  const piece = state.board[from];

  const moves: Move[] = [];
  for (const direction of directions) {
    for (let step = 0; step < (steps[direction] ?? 0); step++) {
      let position = 0;
      if (direction === Direction.TOP) {
        position = from + (step + 1) * 8;
      } else if (direction === Direction.RIGHT) {
        position = from + (step + 1) * 1;
      } else if (direction === Direction.BOTTOM) {
        position = from - (step + 1) * 8;
      } else if (direction === Direction.LEFT) {
        position = from - (step + 1) * 1;
      } else if (direction === Direction.TOP_LEFT) {
        position = from + (step + 1) * 7;
      } else if (direction === Direction.TOP_RIGHT) {
        position = from + (step + 1) * 9;
      } else if (direction === Direction.BOTTOM_RIGHT) {
        position = from - (step + 1) * 7;
      } else if (direction === Direction.BOTTOM_LEFT) {
        position = from - (step + 1) * 9;
      }

      if (isValidSquare(position)) {
        if (attackedSquare) {
          if (attackedSquare === position) {
            moves.push({
              piece: piece as Piece,
              from,
              to: position,
              promotion: null,
              castling: null,
            });
          }
        } else {
          moves.push({
            piece: piece as Piece,
            from,
            to: position,
            promotion: null,
            castling: null,
          });
        }
        if (state.board[position]) break;
      } else break;
    }
  }

  return moves;
};
