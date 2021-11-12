import { Move } from "../move.ts";
import { BLACK_KNIGHT, WHITE_KNIGHT } from "./utils.ts";
import { State } from "../state.ts";
import { Square } from "../types.ts";
import { isValidSquare } from "../utils.ts";

export const getKnightPossibleMoves = (state: State, from: Square) => {
  const isWhiteToMove = state.sideToMove === "w";
  const canMoveOrTake = (position: number): position is Square => {
    return isWhiteToMove
      ? state.board[position] <= 0
      : state.board[position] >= 0;
  };

  const piece = isWhiteToMove ? WHITE_KNIGHT : BLACK_KNIGHT;

  const moves: Move[] = [];

  const fileRank = from % 8;

  // not h file
  if (fileRank < 7) {
    const oneOClock = from + 17;
    const fiveOClock = from - 15;
    if (canMoveOrTake(oneOClock)) {
      moves.push({
        piece,
        from,
        to: oneOClock,
        castling: null,
        promotion: null,
      });
    }
    if (canMoveOrTake(fiveOClock)) {
      moves.push({
        piece,
        from,
        to: fiveOClock,
        castling: null,
        promotion: null,
      });
    }
  }

  // not g or h file
  if (fileRank < 6) {
    const twoOClock = from + 10;
    const fourOClock = from - 6;
    if (canMoveOrTake(twoOClock)) {
      moves.push({
        piece,
        from,
        to: twoOClock,
        castling: null,
        promotion: null,
      });
    }
    if (canMoveOrTake(fourOClock)) {
      moves.push({
        piece,
        from,
        to: fourOClock,
        castling: null,
        promotion: null,
      });
    }
  }

  // not a file
  if (fileRank > 0) {
    const sevenOClock = from - 17;
    const elevenOClock = from + 15;
    if (canMoveOrTake(sevenOClock)) {
      moves.push({
        piece,
        from,
        to: sevenOClock,
        castling: null,
        promotion: null,
      });
    }
    if (canMoveOrTake(elevenOClock)) {
      moves.push({
        piece,
        from,
        to: elevenOClock,
        castling: null,
        promotion: null,
      });
    }
  }

  // not a or b file
  if (fileRank > 1) {
    const eightOClock = from - 10;
    const tenOClock = from + 6;
    if (canMoveOrTake(eightOClock)) {
      moves.push({
        piece,
        from,
        to: eightOClock,
        castling: null,
        promotion: null,
      });
    }
    if (canMoveOrTake(tenOClock)) {
      moves.push({
        piece,
        from,
        to: tenOClock,
        castling: null,
        promotion: null,
      });
    }
  }

  return moves;
};

export const getKnightPossibleAttacks = (
  state: State,
  from: Square,
  attackedSquare?: Square,
) => {
  const isWhiteToMove = state.sideToMove === "w";
  const moves: Move[] = [];

  const piece = isWhiteToMove ? WHITE_KNIGHT : BLACK_KNIGHT;

  const fileRank = from % 8;

  // not h file
  if (fileRank < 7) {
    const oneOClock = from + 17;
    const fiveOClock = from - 15;
    if (isValidSquare(oneOClock)) {
      if (attackedSquare) {
        if (attackedSquare === oneOClock) {
          moves.push({
            piece,
            from,
            to: oneOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: oneOClock,
          promotion: null,
          castling: null,
        });
      }
    }
    if (isValidSquare(fiveOClock)) {
      if (attackedSquare) {
        if (attackedSquare === fiveOClock) {
          moves.push({
            piece,
            from,
            to: fiveOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: fiveOClock,
          promotion: null,
          castling: null,
        });
      }
    }
  }

  // not g or h file
  if (fileRank < 6) {
    const twoOClock = from + 10;
    const fourOClock = from - 6;
    if (isValidSquare(twoOClock)) {
      if (attackedSquare) {
        if (attackedSquare === twoOClock) {
          moves.push({
            piece,
            from,
            to: twoOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: twoOClock,
          promotion: null,
          castling: null,
        });
      }
    }
    if (isValidSquare(fourOClock)) {
      if (attackedSquare) {
        if (attackedSquare === fourOClock) {
          moves.push({
            piece,
            from,
            to: fourOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: fourOClock,
          promotion: null,
          castling: null,
        });
      }
    }
  }

  // not a file
  if (fileRank > 0) {
    const sevenOClock = from - 17;
    const elevenOClock = from + 15;
    if (isValidSquare(sevenOClock)) {
      if (attackedSquare) {
        if (attackedSquare === sevenOClock) {
          moves.push({
            piece,
            from,
            to: sevenOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: sevenOClock,
          promotion: null,
          castling: null,
        });
      }
    }
    if (isValidSquare(elevenOClock)) {
      if (attackedSquare) {
        if (attackedSquare === elevenOClock) {
          moves.push({
            piece,
            from,
            to: elevenOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: elevenOClock,
          promotion: null,
          castling: null,
        });
      }
    }
  }

  // not a or b file
  if (fileRank > 1) {
    const eightOClock = from - 10;
    const tenOClock = from + 6;
    if (isValidSquare(eightOClock)) {
      if (attackedSquare) {
        if (attackedSquare === eightOClock) {
          moves.push({
            piece,
            from,
            to: eightOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: eightOClock,
          promotion: null,
          castling: null,
        });
      }
    }
    if (isValidSquare(tenOClock)) {
      if (attackedSquare) {
        if (attackedSquare === tenOClock) {
          moves.push({
            piece,
            from,
            to: tenOClock,
            promotion: null,
            castling: null,
          });
        }
      } else {
        moves.push({
          piece,
          from,
          to: tenOClock,
          promotion: null,
          castling: null,
        });
      }
    }
  }

  return moves;
};
