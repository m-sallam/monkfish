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

export type Castling = "k" | "q" | "K" | "Q" | null;

export type Promotion = "Q" | "N" | "R" | "B" | null;

export type File = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Rank = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type EnPassant = Square | null;
