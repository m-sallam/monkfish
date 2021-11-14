import {
  BLACK_BISHOP,
  BLACK_KNIGHT,
  BLACK_QUEEN,
  BLACK_ROOK,
  WHITE_BISHOP,
  WHITE_KNIGHT,
  WHITE_QUEEN,
  WHITE_ROOK,
} from "./pieces/utils.ts";

export type Color = "w" | "b";

export type Square =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63;

export type Castling =
  | null
  | Exclude<`${"K" | ""}${"Q" | ""}${"k" | ""}${"q" | ""}`, "">;

export type MoveCastling = "K" | "Q" | null;

export type Promotion =
  | typeof BLACK_QUEEN
  | typeof WHITE_QUEEN
  | typeof BLACK_KNIGHT
  | typeof WHITE_KNIGHT
  | typeof BLACK_ROOK
  | typeof WHITE_ROOK
  | typeof BLACK_BISHOP
  | typeof WHITE_BISHOP
  | null;

export type File = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type FileNotation = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

export type Rank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RankNotation = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export type BoardPositionNotation = `${FileNotation}${RankNotation}`;

export type EnPassant = Square | null;
