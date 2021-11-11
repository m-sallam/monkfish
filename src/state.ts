import {
  Board,
  getDefaultBlackPositions,
  getDefaultWhitePositions,
  getEmptyBoard,
} from "./board.ts";
import { Color, EnPassant } from "./types.ts";

export interface State {
  board: Board;

  sideToMove: Color;

  whitePositions: Board;

  blackPositions: Board;

  halfMoveCount: number;

  moveCount: number;

  nonTakeMoveCount: number;

  kingPosition: [number, number];

  enPassant: EnPassant;
}

export const getEmptyState = (): State => ({
  board: getEmptyBoard(),
  sideToMove: "w",
  whitePositions: getDefaultWhitePositions(),
  blackPositions: getDefaultBlackPositions(),
  halfMoveCount: 0,
  moveCount: 1,
  nonTakeMoveCount: 0,
  kingPosition: [4, 60],
  enPassant: null,
});

export const copyState = (state: State): State => ({
  board: state.board.slice(),
  sideToMove: state.sideToMove,
  whitePositions: state.whitePositions.slice(),
  blackPositions: state.blackPositions.slice(),
  halfMoveCount: state.halfMoveCount,
  moveCount: state.moveCount,
  nonTakeMoveCount: state.nonTakeMoveCount,
  kingPosition: [state.kingPosition[0], state.blackPositions[1]],
  enPassant: state.enPassant,
});
