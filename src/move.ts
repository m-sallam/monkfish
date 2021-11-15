import { MoveError } from "./error.ts";
import {
  BLACK_KING,
  BLACK_PAWN,
  BLACK_ROOK,
  Piece,
  WHITE_KING,
  WHITE_PAWN,
  WHITE_ROOK,
} from "./pieces/utils.ts";
import { State } from "./state.ts";
import {
  BoardPositionNotationMove,
  Castling,
  EnPassant,
  MoveCastling,
  Promotion,
  Square,
} from "./types.ts";
import {
  boardPositionNotationToSquare,
  isSquareOnRank,
  isValidSquare,
} from "./utils.ts";

export interface Move {
  piece: Piece;

  from: Square;

  to: Square;

  castling: MoveCastling;

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

  // en passant
  if (move.to === state.enPassant) {
    if (move.piece === WHITE_PAWN) {
      state.board[state.enPassant - 8] = 0;
      state.blackPositions[state.enPassant - 8] = 0;
    } else if (move.piece === BLACK_PAWN) {
      state.board[state.enPassant + 8] = 0;
      state.whitePositions[state.enPassant + 8] = 0;
    }
  }

  // castling
  if (move.castling) {
    if (move.castling === "K") {
      if (state.sideToMove === "w") {
        state.board[7] = 0;
        state.board[5] = WHITE_ROOK;
        state.whitePositions[7] = 0;
        state.whitePositions[5] = WHITE_ROOK;
      } else {
        state.board[63] = 0;
        state.board[61] = BLACK_ROOK;
        state.blackPositions[63] = 0;
        state.blackPositions[61] = BLACK_ROOK;
      }
    } else {
      if (state.sideToMove === "w") {
        state.board[0] = 0;
        state.board[3] = WHITE_ROOK;
        state.whitePositions[0] = 0;
        state.whitePositions[3] = WHITE_ROOK;
      } else {
        state.board[56] = 0;
        state.board[59] = BLACK_ROOK;
        state.blackPositions[56] = 0;
        state.blackPositions[59] = BLACK_ROOK;
      }
    }
  }

  // update sides position
  if (state.sideToMove === "w") {
    state.whitePositions[move.from] = 0;
    state.whitePositions[move.to] = move.promotion ?? move.piece;
    state.blackPositions[move.to] = 0;
  } else {
    state.blackPositions[move.from] = 0;
    state.blackPositions[move.to] = move.promotion ?? move.piece;
    state.whitePositions[move.to] = 0;
  }

  // update king position
  if (move.piece === WHITE_KING) {
    state.kingPosition[0] = move.to;
  } else if (move.piece === BLACK_KING) {
    state.kingPosition[1] = move.to;
  }
};

export const applyEnPassant = (state: State, move: Move) => {
  // store the latest enPassant square
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
  if (state.sideToMove === "b") {
    state.moveCount += 1;
  }
};

export const applyHalfMoveCount = (state: State, move: Move) => {
  // if it's a take (the square of to has a piece) or it's an enPassant take, reset the count
  if (
    !!state.board[move.to] ||
    (
      move.to === state.enPassant &&
      (move.piece === WHITE_PAWN || move.piece === BLACK_PAWN)
    )
  ) {
    state.halfMoveCount = 0;
  } else {
    state.halfMoveCount += 1;
  }
};

export const updateCastling = (state: State, move: Move) => {
  const removeCastling = (castlingOptions: Castling[]) => {
    state.castling = state.castling
      ?.split("")
      ?.filter((i) => !castlingOptions.includes(i as Castling))
      ?.join("") as Castling;
  };

  if (move.piece === WHITE_KING) removeCastling(["K", "Q"]);
  else if (move.piece === BLACK_KING) removeCastling(["k", "q"]);
  else if (move.piece === WHITE_ROOK) {
    if (move.from === 0) removeCastling(["Q"]);
    if (move.from === 7) removeCastling(["K"]);
  } else if (move.piece === BLACK_ROOK) {
    if (move.from === 56) removeCastling(["q"]);
    if (move.from === 63) removeCastling(["k"]);
  }
  if (state.board[move.to] === WHITE_ROOK) {
    if (move.to === 0) removeCastling(["Q"]);
    if (move.to === 7) removeCastling(["K"]);
  }
  if (state.board[move.to] === BLACK_ROOK) {
    if (move.to === 56) removeCastling(["q"]);
    if (move.to === 63) removeCastling(["k"]);
  }
};

export const boardPositionNotationMoveToMove = (
  possibleMoves: Move[],
  moveObject: BoardPositionNotationMove,
): Move => {
  const from = boardPositionNotationToSquare(moveObject.from);
  const to = boardPositionNotationToSquare(moveObject.to);

  if (!isValidSquare(from) || !isValidSquare(to)) {
    throw new MoveError("invalid move");
  }

  const move = possibleMoves.find((m) => m.from === from && m.to === to);
  if (!move) throw new MoveError("invalid move");

  return move;
};
