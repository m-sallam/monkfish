import { Move } from "../move.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { isSquareOnFile, isSquareOnRank, isValidSquare } from "../utils.ts";
import {
  BLACK_BISHOP,
  BLACK_KNIGHT,
  BLACK_PAWN,
  BLACK_QUEEN,
  BLACK_ROOK,
  WHITE_BISHOP,
  WHITE_KNIGHT,
  WHITE_PAWN,
  WHITE_QUEEN,
  WHITE_ROOK,
} from "./utils.ts";

export let promotions = 0;

export const getPawnMovesForBlack = (state: State, from: Square) => {
  const moves: Move[] = [];

  const oneStepMove = from - 8;
  const twoStepMove = from - 16;

  const isOnInitialRank = isSquareOnRank(from, 6);

  if (isValidSquare(oneStepMove) && !state.board[oneStepMove]) {
    if (isSquareOnRank(oneStepMove, 0)) {
      promotions += 4;
      ([BLACK_QUEEN, BLACK_KNIGHT, BLACK_ROOK, BLACK_BISHOP] as const).forEach(
        (piece) => {
          moves.push({
            piece: BLACK_PAWN,
            from,
            to: oneStepMove,
            castling: null,
            promotion: piece,
          });
        },
      );
    } else {
      moves.push({
        piece: BLACK_PAWN,
        from,
        to: oneStepMove,
        castling: null,
        promotion: null,
      });
    }
  }
  if (
    isValidSquare(twoStepMove) && isOnInitialRank &&
    !state.board[oneStepMove] && !state.board[twoStepMove]
  ) {
    moves.push({
      piece: BLACK_PAWN,
      from,
      to: twoStepMove,
      castling: null,
      promotion: null,
    });
  }

  // takes

  if (!isSquareOnFile(from, 0)) {
    const rightAttackMove = from - 9;
    const pieceOnPosition = state.board[rightAttackMove];

    if (
      isValidSquare(rightAttackMove) &&
      (pieceOnPosition > 0 || rightAttackMove === state.enPassant)
    ) {
      if (isSquareOnRank(rightAttackMove, 0)) {
        promotions += 4;
        ([BLACK_QUEEN, BLACK_KNIGHT, BLACK_ROOK, BLACK_BISHOP] as const)
          .forEach((piece) => {
            moves.push({
              piece: BLACK_PAWN,
              from,
              to: rightAttackMove,
              castling: null,
              promotion: piece,
            });
          });
      } else {
        moves.push({
          piece: BLACK_PAWN,
          from,
          to: rightAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  if (!isSquareOnFile(from, 7)) {
    const leftAttackMove = from - 7;
    const pieceOnPosition = state.board[leftAttackMove];

    if (
      isValidSquare(leftAttackMove) &&
      (pieceOnPosition > 0 || leftAttackMove === state.enPassant)
    ) {
      if (isSquareOnRank(leftAttackMove, 0)) {
        promotions += 4;
        ([BLACK_QUEEN, BLACK_KNIGHT, BLACK_ROOK, BLACK_BISHOP] as const)
          .forEach((piece) => {
            moves.push({
              piece: BLACK_PAWN,
              from,
              to: leftAttackMove,
              castling: null,
              promotion: piece,
            });
          });
      } else {
        moves.push({
          piece: BLACK_PAWN,
          from,
          to: leftAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  return moves;
};

export const getPawnMovesForWhite = (state: State, from: Square) => {
  const moves: Move[] = [];

  const oneStepMove = from + 8;
  const twoStepMove = from + 16;

  const isOnInitialRank = isSquareOnRank(from, 1);

  if (isValidSquare(oneStepMove) && !state.board[oneStepMove]) {
    if (isSquareOnRank(oneStepMove, 7)) {
      ([WHITE_QUEEN, WHITE_KNIGHT, WHITE_ROOK, WHITE_BISHOP] as const)
        .forEach((piece) => {
          moves.push({
            piece: WHITE_PAWN,
            from,
            to: oneStepMove,
            castling: null,
            promotion: piece,
          });
        });
    } else {
      moves.push({
        piece: WHITE_PAWN,
        from,
        to: oneStepMove,
        castling: null,
        promotion: null,
      });
    }
  }
  if (
    isValidSquare(twoStepMove) && isOnInitialRank &&
    !state.board[oneStepMove] && !state.board[twoStepMove]
  ) {
    moves.push({
      piece: WHITE_PAWN,
      from,
      to: twoStepMove,
      castling: null,
      promotion: null,
    });
  }

  // takes

  if (!isSquareOnFile(from, 0)) {
    const leftAttackMove = from + 7;
    const pieceOnPosition = state.board[leftAttackMove];

    if (
      isValidSquare(leftAttackMove) &&
      (pieceOnPosition < 0 || leftAttackMove === state.enPassant)
    ) {
      if (isSquareOnRank(leftAttackMove, 7)) {
        ([WHITE_QUEEN, WHITE_KNIGHT, WHITE_ROOK, WHITE_BISHOP] as const)
          .forEach((piece) => {
            moves.push({
              piece: WHITE_PAWN,
              from,
              to: leftAttackMove,
              castling: null,
              promotion: piece,
            });
          });
      } else {
        moves.push({
          piece: WHITE_PAWN,
          from,
          to: leftAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  if (!isSquareOnFile(from, 7)) {
    const rightAttackMove = from + 9;
    const pieceOnPosition = state.board[rightAttackMove];

    if (
      isValidSquare(rightAttackMove) &&
      (pieceOnPosition < 0 || rightAttackMove === state.enPassant)
    ) {
      if (isSquareOnRank(rightAttackMove, 7)) {
        ([WHITE_QUEEN, WHITE_KNIGHT, WHITE_ROOK, WHITE_BISHOP] as const)
          .forEach((piece) => {
            moves.push({
              piece: WHITE_PAWN,
              from,
              to: rightAttackMove,
              castling: null,
              promotion: piece,
            });
          });
      } else {
        moves.push({
          piece: WHITE_PAWN,
          from,
          to: rightAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  return moves;
};

export const getPawnAttacksForBlack = (
  // deno-lint-ignore no-unused-vars
  state: State,
  from: Square,
  attackedSquare?: Square,
) => {
  const moves: Move[] = [];

  if (!isSquareOnFile(from, 0)) {
    const rightAttackMove = from - 9;

    if (isValidSquare(rightAttackMove)) {
      if (typeof attackedSquare === "number") {
        if (attackedSquare === rightAttackMove) {
          moves.push({
            piece: BLACK_PAWN,
            from,
            to: rightAttackMove,
            castling: null,
            promotion: null,
          });
        }
      } else {
        moves.push({
          piece: BLACK_PAWN,
          from,
          to: rightAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  if (!isSquareOnFile(from, 7)) {
    const leftAttackMove = from - 7;

    if (isValidSquare(leftAttackMove)) {
      if (typeof attackedSquare === "number") {
        if (attackedSquare === leftAttackMove) {
          moves.push({
            piece: BLACK_PAWN,
            from,
            to: leftAttackMove,
            castling: null,
            promotion: null,
          });
        }
      } else {
        moves.push({
          piece: BLACK_PAWN,
          from,
          to: leftAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  return moves;
};

export const getPawnAttacksForWhite = (
  // deno-lint-ignore no-unused-vars
  state: State,
  from: Square,
  attackedSquare?: Square,
) => {
  const moves: Move[] = [];

  if (!isSquareOnFile(from, 0)) {
    const leftAttackMove = from + 7;

    if (isValidSquare(leftAttackMove)) {
      if (typeof attackedSquare === "number") {
        if (attackedSquare === leftAttackMove) {
          moves.push({
            piece: WHITE_PAWN,
            from,
            to: leftAttackMove,
            castling: null,
            promotion: null,
          });
        }
      } else {
        moves.push({
          piece: WHITE_PAWN,
          from,
          to: leftAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  if (!isSquareOnFile(from, 7)) {
    const rightAttackMove = from + 9;

    if (isValidSquare(rightAttackMove)) {
      if (typeof attackedSquare === "number") {
        if (attackedSquare === rightAttackMove) {
          moves.push({
            piece: WHITE_PAWN,
            from,
            to: rightAttackMove,
            castling: null,
            promotion: null,
          });
        }
      } else {
        moves.push({
          piece: WHITE_PAWN,
          from,
          to: rightAttackMove,
          castling: null,
          promotion: null,
        });
      }
    }
  }

  return moves;
};
