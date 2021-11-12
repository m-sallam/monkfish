import {
  BlackPiece,
  Empty,
  isBlackPiece,
  isWhitePiece,
  Piece,
  WhitePiece,
} from "./pieces/utils.ts";

export type Board = Array<Piece | Empty>;
export type WhitePositions = Array<WhitePiece | Empty>;
export type BlackPosition = Array<BlackPiece | Empty>;

const emptyBoard: Board = new Array(64).fill(0);

export const getEmptyBoard = (): Board => emptyBoard.slice();

const defaultBlackPositions = emptyBoard.slice()
  .fill(-1, 48, 56)
  .fill(-4, 56, 57)
  .fill(-2, 57, 58)
  .fill(-3, 58, 59)
  .fill(-5, 59, 60)
  .fill(-6, 60, 61)
  .fill(-3, 61, 62)
  .fill(-2, 62, 63)
  .fill(-4, 63);

export const getDefaultBlackPositions = () =>
  defaultBlackPositions.slice() as BlackPosition;

const defaultWhitePositions = emptyBoard.slice()
  .fill(1, 8, 16)
  .fill(4, 7, 8)
  .fill(2, 6, 7)
  .fill(3, 5, 6)
  .fill(5, 3, 4)
  .fill(6, 4, 5)
  .fill(3, 2, 3)
  .fill(2, 1, 2)
  .fill(4, 0, 1);

export const getDefaultWhitePositions = () =>
  defaultWhitePositions.slice() as WhitePositions;

export const populateColorsPositions = (board: Board) => {
  const blackPositions = getEmptyBoard();
  const whitePositions = getEmptyBoard();

  board.forEach((piece, position) => {
    if (isWhitePiece(piece)) whitePositions[position] = piece;
    else if (isBlackPiece(piece)) blackPositions[position] = piece;
  });

  return {
    whitePositions: whitePositions as WhitePositions,
    blackPositions: blackPositions as BlackPosition,
  };
};
