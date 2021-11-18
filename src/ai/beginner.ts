import { Game } from "../game.ts";
import { Move } from "../move.ts";
import { possibleMoves } from "../moves.ts";
import { pstForBlack } from "./utils.ts";
import { pieceWeights, pstForWhite } from "./utils.ts";

export const getBestMove = (
  game: Game,
  depth = 1,
  isAISide = true,
  alpha = -Infinity,
  beta = Infinity,
  score = 0,
): { move: Move | null; score: number } => {
  const moves = possibleMoves(game);

  if (depth < 1 || !moves.length) return { move: null, score };

  let highestScore = -Infinity;
  let lowestScore = Infinity;
  let bestMove: Move | null = null;

  for (const move of moves) {
    const moveScore = getMoveScore(game, move, isAISide) + score;

    game.move(move);
    const { score: childBestScore } = getBestMove(
      game,
      depth - 1,
      !isAISide,
      alpha,
      beta,
      moveScore,
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

export const getMoveScore = (game: Game, move: Move, isAISide: boolean) => {
  const { from, to, piece, promotion } = move;
  const state = game.state();

  let score = 0;

  // take
  const pieceOnTarget = state.board[to];
  if (pieceOnTarget !== 0) {
    const pst = game.sideToMove() === "w" ? pstForBlack : pstForWhite;
    if (isAISide) {
      // @ts-ignore not gonna bother going through hoops to make it work, this should be fine
      score += pieceWeights[pieceOnTarget] + pst[pieceOnTarget][to];
    } else {
      // @ts-ignore not gonna bother going through hoops to make it work, this should be fine
      score -= pieceWeights[pieceOnTarget] + pst[pieceOnTarget][to];
    }
  }

  const targetPiece = promotion || piece;
  const pst = game.sideToMove() === "w" ? pstForWhite : pstForBlack;

  if (isAISide) {
    // @ts-ignore again
    score += pieceWeights[targetPiece] + pst[targetPiece][to];
    // @ts-ignore again
    score -= pieceWeights[piece] + pst[piece][from];
  } else {
    // @ts-ignore again
    score -= pieceWeights[targetPiece] + pst[targetPiece][to];
    // @ts-ignore again
    score += pieceWeights[piece] + pst[piece][from];
  }

  return score;
};
