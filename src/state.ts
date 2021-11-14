import { Board, getEmptyBoard } from "./board.ts";
import { Castling, Color, EnPassant, Square } from "./types.ts";

export interface State {
  board: Board;

  sideToMove: Color;

  whitePositions: Board;

  blackPositions: Board;

  halfMoveCount: number;

  moveCount: number;

  kingPosition: [Square, Square];

  enPassant: EnPassant;

  castling: Castling;
}

export const getEmptyState = (): State => ({
  board: getEmptyBoard(),
  sideToMove: "w",
  whitePositions: getEmptyBoard(),
  blackPositions: getEmptyBoard(),
  halfMoveCount: 0,
  moveCount: 1,
  kingPosition: [4, 60],
  enPassant: null,
  castling: "KQkq",
});

export const copyState = (state: State): State => ({
  board: state.board.slice(),
  sideToMove: state.sideToMove,
  whitePositions: state.whitePositions.slice(),
  blackPositions: state.blackPositions.slice(),
  halfMoveCount: state.halfMoveCount,
  moveCount: state.moveCount,
  kingPosition: [state.kingPosition[0], state.kingPosition[1]],
  enPassant: state.enPassant,
  castling: state.castling,
});
