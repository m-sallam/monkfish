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

export const possibleMovesForDepth = (game: Game, depth = 1): number => {
  const moves = possibleMoves(game);
  if (depth === 1) return moves.length;

  const innerMoves = moves.reduce((acc, move) => {
    game.move(move);
    const num = acc + possibleMovesForDepth(game, depth - 1);
    game.undo();
    return num;
  }, 0);
  return innerMoves;
};
