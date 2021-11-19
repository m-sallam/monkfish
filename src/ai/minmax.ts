import { Game } from "../game.ts";
import { Move } from "../move.ts";
import { getBishopPossibleMoves } from "../pieces/bishop.ts";
import { getKingPossibleMoves } from "../pieces/king.ts";
import { getKnightPossibleMoves } from "../pieces/knight.ts";
import { getPawnMovesForBlack, getPawnMovesForWhite } from "../pieces/pawn.ts";
import { getQueenPossibleMoves } from "../pieces/queen.ts";
import { getRookPossibleMoves } from "../pieces/rook.ts";
import {
  BLACK_BISHOP,
  BLACK_KING,
  BLACK_KNIGHT,
  BLACK_PAWN,
  BLACK_QUEEN,
  BLACK_ROOK,
  Piece,
  WHITE_BISHOP,
  WHITE_KING,
  WHITE_KNIGHT,
  WHITE_PAWN,
  WHITE_QUEEN,
  WHITE_ROOK,
} from "../pieces/utils.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { blackPST, weights, whitePST } from "./utils.ts";

export const possibleMovesForPosition = (
  state: State,
  square: Square,
  piece: Piece,
) => {
  if (piece === WHITE_PAWN) {
    return getPawnMovesForWhite(state, square);
  } else if (piece === BLACK_PAWN) {
    return getPawnMovesForBlack(state, square);
  } else if (piece === WHITE_KNIGHT || piece === BLACK_KNIGHT) {
    return getKnightPossibleMoves(state, square);
  } else if (piece === WHITE_BISHOP || piece === BLACK_BISHOP) {
    return getBishopPossibleMoves(state, square);
  } else if (piece === WHITE_ROOK || piece === BLACK_ROOK) {
    return getRookPossibleMoves(state, square);
  } else if (piece === WHITE_QUEEN || piece === BLACK_QUEEN) {
    return getQueenPossibleMoves(state, square);
  } else if (piece === WHITE_KING || piece === BLACK_KING) {
    return getKingPossibleMoves(state, square);
  }

  return [];
};

export const getBestMove = (
  game: Game,
  depth = 1,
  isAISide = true,
  alpha = -Infinity,
  beta = Infinity,
  score = 0,
): { move: Move | null; score: number } => {
  if (depth < 1) return { move: null, score };

  const isWhiteToMove = game.sideToMove() === "w";
  const positions = isWhiteToMove
    ? game.state().whitePositions
    : game.state().blackPositions;

  let highestScore = -Infinity;
  let lowestScore = Infinity;
  let bestMove: Move | null = null;

  const moves: Move[] = [];
  positions.forEach((piece, square) => {
    if (piece !== 0) {
      moves.push(
        ...possibleMovesForPosition(game.state(), square as Square, piece),
      );
    }
  });
  if (!moves.length) return { move: null, score };

  const movesWithTheirScore = moves.map((move) => {
    const pieceOnTarget = game.state().board[move.to];
    return [move, getMoveScore(game, move, isAISide, pieceOnTarget)] as const;
  })
    .sort((a, b) => isAISide ? b[1] - a[1] : a[1] - b[1]);

  for (const [move, moveScore] of movesWithTheirScore) {
    game.move(move);

    const { score: childBestScore } = getBestMove(
      game,
      depth - 1,
      !isAISide,
      alpha,
      beta,
      moveScore + score,
    );
    game.undo();

    if (isAISide) {
      if (childBestScore > highestScore) {
        highestScore = childBestScore;
        bestMove = move;
      }
      if (childBestScore > alpha) alpha = childBestScore;
    } else {
      if (childBestScore < lowestScore) {
        lowestScore = childBestScore;
        bestMove = move;
      }
      if (childBestScore < beta) beta = childBestScore;
    }

    if (alpha >= beta) {
      break;
    }
  }

  return { move: bestMove, score: isAISide ? highestScore : lowestScore };
};

export const getMoveScore = (
  game: Game,
  move: Move,
  isAISide: boolean,
  pieceOnTarget: Piece | 0,
) => {
  const { from, to, piece, promotion } = move;

  let score = 0;

  // take
  if (pieceOnTarget !== 0) {
    const pst = game.sideToMove() === "w" ? blackPST : whitePST;
    const pieceOnTargetWeight = weights.get(pieceOnTarget);
    if (isAISide) {
      // @ts-ignore not gonna bother going through hoops to make it work, this should be fine
      score += pieceOnTargetWeight + pst.get(pieceOnTarget)[to];
    } else {
      // @ts-ignore not gonna bother going through hoops to make it work, this should be fine
      score -= pieceOnTargetWeight + pst.get(pieceOnTarget)[to];
    }
  }

  const pieceOrPromotion = promotion || piece;
  const pst = game.sideToMove() === "w" ? whitePST : blackPST;

  if (isAISide) {
    // @ts-ignore again
    score += weights.get(pieceOrPromotion) + pst.get(pieceOrPromotion)[to];
    // @ts-ignore again
    score -= weights.get(piece) + pst.get(piece)[from];
  } else {
    // @ts-ignore again
    score -= weights.get(pieceOrPromotion) + pst.get(pieceOrPromotion)[to];
    // @ts-ignore again
    score += weights.get(piece) + pst.get(piece)[from];
  }

  return score;
};
