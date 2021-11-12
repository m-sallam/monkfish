import {
  BLACK_KING,
  BLACK_PAWN,
  Piece,
  WHITE_KING,
  WHITE_PAWN,
} from "./pieces/utils.ts";
import { State } from "./state.ts";
import { Castling, EnPassant, Promotion, Square } from "./types.ts";
import { isSquareOnRank } from "./utils.ts";

export interface Move {
  piece: Piece;

  from: Square;

  to: Square;

  castling: Castling;

  promotion: Promotion;
}

export enum Direction {
  TOP = "TOP",
  BOTTOM = "BOTTOM",
  RIGHT = "RIGHT",
  LEFT = "LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  TOP_LEFT = "TOP_LEFT",
  BOTTOM_RIGHT = "BOTTOM_RIGHT",
  BOTTOM_LEFT = "BOTTOM_LEFT",
}

export const applyMove = (state: State, move: Move) => {
  state.board[move.from] = 0;
  state.board[move.to] = move.promotion ?? move.piece;

  if (move.to === state.enPassant) {
    if (move.piece === WHITE_PAWN) {
      state.board[state.enPassant - 8] = 0;
      state.blackPositions[state.enPassant - 8] = 0;
    } else if (move.piece === BLACK_PAWN) {
      state.board[state.enPassant + 8] = 0;
      state.whitePositions[state.enPassant + 1] = 0;
    }
  }

  if (state.sideToMove === "w") {
    state.whitePositions[move.from] = 0;
    state.whitePositions[move.to] = move.promotion ?? move.piece;
    state.blackPositions[move.to] = 0;
  } else {
    state.blackPositions[move.from] = 0;
    state.blackPositions[move.to] = move.promotion ?? move.piece;
    state.whitePositions[move.to] = 0;
  }

  if (move.piece === WHITE_KING) {
    state.kingPosition[0] = move.to;
  } else if (move.piece === BLACK_KING) {
    state.kingPosition[1] = move.to;
  }
};

export const applyEnPassant = (state: State, move: Move) => {
  if (
    move.piece === WHITE_PAWN && isSquareOnRank(move.from, 1) &&
    move.to - move.from === 16
  ) {
    state.enPassant = (move.from + 8) as EnPassant;
  } else if (
    move.piece === BLACK_PAWN && isSquareOnRank(move.from, 6) &&
    move.from - move.to === 16
  ) {
    state.enPassant = (move.from - 8) as EnPassant;
  } else state.enPassant = null;
};

export const applyMoveCount = (state: State) => {
  state.halfMoveCount += 1;
  if (state.sideToMove === "b") {
    state.moveCount += 1;
  }
};

export const applyNonTakeMoveCount = (state: State, move: Move) => {
  // if it's a take (the square of to has a piece) or it's an enPassant take, reset the count
  if (
    !!state.board[move.to] ||
    (move.to === state.enPassant &&
      (move.piece === WHITE_PAWN || move.piece === BLACK_PAWN))
  ) {
    state.nonTakeMoveCount = 0;
  } else {
    state.nonTakeMoveCount += 1;
  }
};
