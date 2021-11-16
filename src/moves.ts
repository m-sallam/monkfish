import { Game } from "./game.ts";
import { Move } from "./move.ts";
import {
  BLACK_BISHOP,
  BLACK_KING,
  BLACK_KNIGHT,
  BLACK_PAWN,
  BLACK_QUEEN,
  BLACK_ROOK,
  WHITE_BISHOP,
  WHITE_KING,
  WHITE_KNIGHT,
  WHITE_PAWN,
  WHITE_QUEEN,
  WHITE_ROOK,
} from "./pieces/utils.ts";
import {
  getBishopPossibleAttacks,
  getBishopPossibleMoves,
} from "./pieces/bishop.ts";
import { getKingPossibleAttacks, getKingPossibleMoves } from "./pieces/king.ts";
import {
  getKnightPossibleAttacks,
  getKnightPossibleMoves,
} from "./pieces/knight.ts";
import {
  getPawnAttacksForBlack,
  getPawnAttacksForWhite,
  getPawnMovesForBlack,
  getPawnMovesForWhite,
} from "./pieces/pawn.ts";
import {
  getQueenPossibleAttacks,
  getQueenPossibleMoves,
} from "./pieces/queen.ts";
import { getRookPossibleAttacks, getRookPossibleMoves } from "./pieces/rook.ts";
import { State } from "./state.ts";
import { Color, Square } from "./types.ts";
import { isValidSquare } from "./utils.ts";
import { Piece } from "./pieces/utils.ts";
import { colorOfSquare } from "./utils.ts";

export const possibleMoves = (game: Game) => {
  const state = game.state();
  const isWhiteToMove = state.sideToMove === "w";
  const positions = isWhiteToMove ? state.whitePositions : state.blackPositions;

  const moves: Move[] = [];

  positions.forEach((piece, pos) => {
    if (piece !== 0) {
      if (piece === WHITE_PAWN) {
        moves.push(...getPawnMovesForWhite(state, pos as Square));
      } else if (piece === BLACK_PAWN) {
        moves.push(...getPawnMovesForBlack(state, pos as Square));
      } else if (piece === WHITE_KNIGHT || piece === BLACK_KNIGHT) {
        moves.push(...getKnightPossibleMoves(state, pos as Square));
      } else if (piece === WHITE_BISHOP || piece === BLACK_BISHOP) {
        moves.push(...getBishopPossibleMoves(state, pos as Square));
      } else if (piece === WHITE_ROOK || piece === BLACK_ROOK) {
        moves.push(...getRookPossibleMoves(state, pos as Square));
      } else if (piece === WHITE_QUEEN || piece === BLACK_QUEEN) {
        moves.push(...getQueenPossibleMoves(state, pos as Square));
      } else if (piece === WHITE_KING || piece === BLACK_KING) {
        moves.push(...getKingPossibleMoves(state, pos as Square));
      }
    }
  });

  return moves.filter((m) => !isInCheckAfterMove(game, m));
};

export const possibleMovesForSquare = (game: Game, square: Square) => {
  if (!isValidSquare(square)) return [];

  const state = game.state();
  const isWhiteToMove = state.sideToMove === "w";
  const piece = state.board[square];

  if (!piece) return [];
  if (piece > 0 && !isWhiteToMove) return [];
  if (piece < 0 && isWhiteToMove) return [];

  const moves: Move[] = [];

  if (piece === WHITE_PAWN) {
    moves.push(...getPawnMovesForWhite(state, square));
  } else if (piece === BLACK_PAWN) {
    moves.push(...getPawnMovesForBlack(state, square));
  } else if (piece === WHITE_KNIGHT || piece === BLACK_KNIGHT) {
    moves.push(...getKnightPossibleMoves(state, square));
  } else if (piece === WHITE_BISHOP || piece === BLACK_BISHOP) {
    moves.push(...getBishopPossibleMoves(state, square));
  } else if (piece === WHITE_ROOK || piece === BLACK_ROOK) {
    moves.push(...getRookPossibleMoves(state, square));
  } else if (piece === WHITE_QUEEN || piece === BLACK_QUEEN) {
    moves.push(...getQueenPossibleMoves(state, square));
  } else if (piece === WHITE_KING || piece === BLACK_KING) {
    moves.push(...getKingPossibleMoves(state, square));
  }

  return moves.filter((m) => !isInCheckAfterMove(game, m));
};

export const isColorAttackingSquare = (
  color: Color,
  state: State,
  square: Square,
) => {
  const positions = color === "w" ? state.whitePositions : state.blackPositions;

  const isAttacked = positions.some((piece, pos) => {
    if (piece !== 0) {
      if (piece === WHITE_PAWN) {
        return !!getPawnAttacksForWhite(state, pos as Square, square).length;
      } else if (piece === BLACK_PAWN) {
        return !!getPawnAttacksForBlack(state, pos as Square, square).length;
      } else if (piece === WHITE_KNIGHT || piece === BLACK_KNIGHT) {
        return !!getKnightPossibleAttacks(state, pos as Square, square).length;
      } else if (piece === WHITE_BISHOP || piece === BLACK_BISHOP) {
        return !!getBishopPossibleAttacks(state, pos as Square, square).length;
      } else if (piece === WHITE_ROOK || piece === BLACK_ROOK) {
        return !!getRookPossibleAttacks(state, pos as Square, square).length;
      } else if (piece === WHITE_QUEEN || piece === BLACK_QUEEN) {
        return !!getQueenPossibleAttacks(state, pos as Square, square).length;
      } else if (piece === WHITE_KING || piece === BLACK_KING) {
        return !!getKingPossibleAttacks(state, pos as Square, square).length;
      }
    }
    return false;
  });

  return isAttacked;
};

export const isInCheckAfterMove = (
  game: Game,
  move: Move,
) => {
  const state = game.state();

  const isWhiteToMove = state.sideToMove === "w";

  game.move(move);

  const kingPosition = isWhiteToMove
    ? state.kingPosition[0]
    : state.kingPosition[1];

  const attacked = isColorAttackingSquare(
    isWhiteToMove ? "b" : "w",
    state,
    kingPosition,
  );

  game.undo();

  return attacked;
};

export const hasInsufficientPieces = (state: State) => {
  const { whitePositions, blackPositions } = state;

  const whitePieces = whitePositions.filter((p: Piece | 0) => p > 1);
  const blackPieces = blackPositions.filter((p: Piece | 0) => p < 1);

  const whiteHasKingOnly = whitePieces.length === 1;
  const blackHasKingOnly = blackPieces.length === 1;
  if (whiteHasKingOnly && blackHasKingOnly) return true;

  const whiteHas2Pieces = whitePieces.length === 2;
  const blackHas2Pieces = blackPieces.length === 2;
  if (
    (!whiteHasKingOnly && !whiteHas2Pieces) ||
    (!blackHasKingOnly && !blackHas2Pieces)
  ) {
    return false;
  }

  const whiteSecondPiece = whitePieces.find((p) => p !== WHITE_KING);
  const blackSecondPiece = blackPieces.find((p) => p !== BLACK_KING);

  if (whiteHasKingOnly) {
    if (blackSecondPiece === BLACK_BISHOP) return true;
    if (blackSecondPiece === BLACK_KNIGHT) return true;
    return false;
  }

  if (blackHasKingOnly) {
    if (whiteSecondPiece === WHITE_BISHOP) return true;
    if (whiteSecondPiece === WHITE_KNIGHT) return true;
    return false;
  }

  if (whiteSecondPiece === WHITE_BISHOP && blackSecondPiece === BLACK_BISHOP) {
    if (
      colorOfSquare(state.board.indexOf(whiteSecondPiece) as Square) ===
        colorOfSquare(state.board.indexOf(blackSecondPiece) as Square)
    ) {
      return true;
    }
  }

  return false;
};
