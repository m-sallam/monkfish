import {
  Board,
  getDefaultBlackPositions,
  getDefaultWhitePositions,
  populateColorsPositions,
} from "./board.ts";
import { fenToBoard } from "./fen.ts";
import { BLACK_KING, WHITE_KING } from "./pieces/utils.ts";
import { Color, EnPassant, Square } from "./types.ts";

export interface State {
  board: Board;

  sideToMove: Color;

  whitePositions: Board;

  blackPositions: Board;

  halfMoveCount: number;

  moveCount: number;

  nonTakeMoveCount: number;

  kingPosition: [Square, Square];

  enPassant: EnPassant;
}

export const getEmptyState = (): State => ({
  board: fenToBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"),
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
  kingPosition: [state.kingPosition[0], state.kingPosition[1]],
  enPassant: state.enPassant,
});

export const fenToState = (fen: string): State => {
  const board = fenToBoard(fen);
  const { blackPositions, whitePositions } = populateColorsPositions(board);
  return {
    ...getEmptyState(),
    board,
    blackPositions,
    whitePositions,
    kingPosition: [
      board.findIndex((piece) => piece === WHITE_KING) as Square,
      board.findIndex((piece) => piece === BLACK_KING) as Square,
    ],
  };
};
