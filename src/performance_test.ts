import { Game } from "./game.ts";
import { possibleMoves } from "./moves.ts";

export const performanceTesting = (game: Game, depth = 1): number => {
  const moves = possibleMoves(game);
  if (depth === 1) return moves.length;

  const innerMovesCount = moves.reduce((acc, move) => {
    game.move(move);
    const num = acc + performanceTesting(game, depth - 1);
    game.undo();
    return num;
  }, 0);

  return innerMovesCount;
};
