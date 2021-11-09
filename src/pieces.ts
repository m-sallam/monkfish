export const EMPTY = 0;
export const WHITE_PAWN = 1;
export const BLACK_PAWN = -1;
export const WHITE_KNIGHT = 2;
export const BLACK_KNIGHT = -2;
export const WHITE_BISHOP = 3;
export const BLACK_BISHOP = -3;
export const WHITE_ROOK = 4;
export const BLACK_ROOK = -4;
export const WHITE_QUEEN = 5;
export const BLACK_QUEEN = -5;
export const WHITE_KING = 6;
export const BLACK_KING = -6;

export type WhitePiece =
  | typeof WHITE_PAWN
  | typeof WHITE_KNIGHT
  | typeof WHITE_BISHOP
  | typeof WHITE_ROOK
  | typeof WHITE_QUEEN
  | typeof WHITE_KING;

export type BlackPiece =
  | typeof BLACK_PAWN
  | typeof BLACK_KNIGHT
  | typeof BLACK_BISHOP
  | typeof BLACK_ROOK
  | typeof BLACK_QUEEN
  | typeof BLACK_KING;
export type Piece = WhitePiece | BlackPiece;

export type Empty = typeof EMPTY;

export const pieceLettersToValueMap: Record<string, Piece> = {
  p: BLACK_PAWN,
  P: WHITE_PAWN,
  n: BLACK_KNIGHT,
  N: WHITE_KNIGHT,
  b: BLACK_BISHOP,
  B: WHITE_BISHOP,
  r: BLACK_ROOK,
  R: WHITE_ROOK,
  q: BLACK_QUEEN,
  Q: WHITE_QUEEN,
  k: BLACK_KING,
  K: WHITE_KING,
};

export const pieceValueToLetterMap = Object.fromEntries(
  Object.entries(pieceLettersToValueMap).map(([key, value]) => [value, key]),
);

export const isWhitePiece = (piece: Piece | Empty): piece is WhitePiece =>
  piece > 0;
export const isBlackPiece = (piece: Piece | Empty): piece is BlackPiece =>
  piece < 0;
