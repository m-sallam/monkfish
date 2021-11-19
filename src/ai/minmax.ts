import { Game } from "../game.ts";
import { Move } from "../move.ts";
import { possibleMoves } from "../moves.ts";
import { blackPST, weights, whitePST } from "./utils.ts";

export const getBestMove = (
  game: Game,
  depth = 1,
  isAISide = true,
  alpha = -Infinity,
  beta = Infinity,
  score = 0,
): { move: Move | null; score: number } => {
  if (depth < 1) return { move: null, score };

  const moves = possibleMoves(game);
  if (!moves.length) {
    if (game.isInCheck()) {
      return { move: null, score: isAISide ? -(10 ** 10) : 10 ** 10 };
    }
    return { move: null, score };
  }

  let highestScore = -Infinity;
  let lowestScore = Infinity;
  let bestMove: Move | null = null;

  const movesWithTheirScore = moves.map((move) => {
    return [move, getMoveScore(game, move, isAISide)] as const;
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

    if (alpha >= beta) break;
  }

  return { move: bestMove, score: isAISide ? highestScore : lowestScore };
};

export const getMoveScore = (
  game: Game,
  move: Move,
  isAISide: boolean,
) => {
  const { from, to, piece, promotion } = move;

  let score = 0;

  // take
  const pieceOnTarget = game.state().board[to];
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
