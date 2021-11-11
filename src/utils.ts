import { Color, File, Rank, Square } from "./types.ts";

export const oppositeColor = (color: Color) => color === "w" ? "b" : "w";

export const isSquareOnRank = (square: Square, rank: Rank) =>
  Math.floor(square / 8) === rank;

export const isSquareOnFile = (square: Square, file: File) =>
  square % 8 === file;
