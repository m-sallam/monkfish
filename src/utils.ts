import { Board } from "./board.ts";
import { Move } from "./move.ts";
import { pieceValueToLetterMap } from "./pieces/utils.ts";
import {
  BoardPositionNotation,
  BoardPositionNotationMove,
  Color,
  File,
  FileNotation,
  Rank,
  RankNotation,
  Square,
} from "./types.ts";

export const defaultFen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const oppositeColor = (color: Color) => color === "w" ? "b" : "w";

export const isSquareOnRank = (square: Square, rank: Rank) =>
  Math.floor(square / 8) === rank;

export const isSquareOnFile = (square: Square, file: File) =>
  square % 8 === file;

export const isValidSquare = (square: number): square is Square =>
  square >= 0 && square <= 63;

export const FileNotationToFile: Record<FileNotation, File> = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

export const FileToFileNotation = Object
  .fromEntries(
    Object.entries(FileNotationToFile).map(([key, value]) => [value, key]),
  );

export const RankNotationToRank: Record<RankNotation, Rank> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
};

export const RankToRankNotation = Object
  .fromEntries(
    Object.entries(RankNotationToRank).map(([key, value]) => [value, key]),
  );

export const boardPositionNotationToSquare = (
  position: BoardPositionNotation,
): Square => {
  const file = FileNotationToFile[position[0] as FileNotation];
  const rank = RankNotationToRank[position[1] as RankNotation];

  const square = ((rank * 8) + file) as Square;

  return square;
};

export const squareToBoardPositionNotation = (
  square: Square,
): string => {
  const file = (square % 8) as File;
  const rank = Math.floor(square / 8) as Rank;

  return `${FileToFileNotation[file]}${RankToRankNotation[rank]}`;
};

export const printBoard = (board: Board) => {
  // this is bad, but i want to sleep so...
  console.log("                          ");
  console.log("__________________________");
  console.log("                          ");

  for (let rank = 7; rank >= 0; rank -= 1) {
    let line = "";
    for (let file = 0; file < 8; file += 1) {
      line += pieceValueToLetterMap[board[(8 * rank) + file]] || "-";
      line += "  ";
    }
    console.log(`${rank + 1}   ${line}`);
  }

  console.log("                          ");
  console.log("    a  b  c  d  e  f  g  h");
  console.log("__________________________");
  console.log("                          ");
};

export const isBoardPositionNotationMove = (
  m: Move | BoardPositionNotationMove,
): m is BoardPositionNotationMove => {
  return typeof m.from === "string";
};
