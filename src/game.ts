import { getBestMove } from "./ai/minmax.ts";
import { fenToState, stateToFen } from "./fen.ts";
import {
  applyEnPassant,
  applyHalfMoveCount,
  applyMove,
  applyMoveCount,
  boardPositionNotationMoveToMove,
  Move,
  updateCastling,
} from "./move.ts";
import {
  hasInsufficientPieces,
  isColorAttackingSquare,
  possibleMoves,
  possibleMovesForSquare,
} from "./moves.ts";
import { Piece, pieceValueToLetterMap } from "./pieces/utils.ts";
import { copyState, State } from "./state.ts";
import {
  BoardPositionNotation,
  BoardPositionNotationMove,
  Square,
} from "./types.ts";
import {
  boardPositionNotationToSquare,
  defaultFen,
  isBoardPositionNotationMove,
  oppositeColor,
  squareToBoardPositionNotation,
} from "./utils.ts";

export class Game {
  #state: State;

  #history: State[] = [];

  constructor(fen?: string) {
    this.#state = fenToState(fen ?? defaultFen);
  }

  #save() {
    this.#history.push(copyState(this.#state));
  }

  load(fen: string) {
    this.#state = fenToState(fen);
  }

  isGameOver() {
    const moves = possibleMoves(this);
    if (!moves.length) return true;
    if (this.#state.halfMoveCount >= 50) return true;
    if (hasInsufficientPieces(this.#state)) return true;
    return false;
  }

  isInCheck() {
    const isWhiteToMove = this.#state.sideToMove === "w";

    const kingPosition = isWhiteToMove
      ? this.#state.kingPosition[0]
      : this.#state.kingPosition[1];

    const attacked = isColorAttackingSquare(
      isWhiteToMove ? "b" : "w",
      this.#state,
      kingPosition,
    );

    return attacked;
  }

  status() {
    const moves = possibleMoves(this);
    const fiftyRuleDraw = this.#state.halfMoveCount >= 50;
    const insufficientPieces = hasInsufficientPieces(this.#state);
    const inCheck = this.isInCheck();

    if (moves.length && !fiftyRuleDraw && !insufficientPieces) {
      return "playing";
    }

    if (!moves.length) {
      const oppositeColor = this.#state.sideToMove === "w" ? "black" : "white";
      if (inCheck) return `${oppositeColor} won by checkmate`;
      else return `draw by stalemate`;
    }

    if (fiftyRuleDraw) return `draw by fifty rule`;
    if (insufficientPieces) return `draw by insufficient pieces`;
  }

  sideToMove() {
    return this.#state.sideToMove;
  }

  state() {
    return this.#state;
  }

  fen() {
    return stateToFen(this.#state);
  }

  pieceOnSquare(square: Square | BoardPositionNotation) {
    let piece: Piece | 0;
    if (typeof square === "string") {
      piece = this.#state.board[boardPositionNotationToSquare(square)];
    } else {
      piece = this.#state.board[square];
    }

    if (!piece) return null;
    return pieceValueToLetterMap[piece];
  }

  possibleMoves() {
    return possibleMoves(this).map((move) => ({
      from: squareToBoardPositionNotation(move.from),
      to: squareToBoardPositionNotation(move.to),
      promotion: move.promotion ? pieceValueToLetterMap[move.promotion] : null,
      piece: pieceValueToLetterMap[move.piece],
      castling: move.castling,
    }));
  }

  bestMove(depth = 6) {
    const { move } = getBestMove(this, depth);
    if (!move) return null;
    return {
      from: squareToBoardPositionNotation(move.from),
      to: squareToBoardPositionNotation(move.to),
      promotion: move.promotion ? pieceValueToLetterMap[move.promotion] : null,
      piece: pieceValueToLetterMap[move.piece],
      castling: move.castling,
    };
  }

  possibleMovesForPosition(position: BoardPositionNotation) {
    const square = boardPositionNotationToSquare(position);
    return possibleMovesForSquare(this, square).map((move) => ({
      from: squareToBoardPositionNotation(move.from),
      to: squareToBoardPositionNotation(move.to),
      promotion: move.promotion ? pieceValueToLetterMap[move.promotion] : null,
      piece: pieceValueToLetterMap[move.piece],
      castling: move.castling,
    }));
  }

  #move(move: Move) {
    this.#save();

    applyHalfMoveCount(this.#state, move);
    applyMoveCount(this.#state);
    updateCastling(this.#state, move);
    applyMove(this.#state, move);
    applyEnPassant(this.#state, move);

    this.#state.sideToMove = oppositeColor(this.#state.sideToMove);
  }

  move(move: Move | BoardPositionNotationMove) {
    if (isBoardPositionNotationMove(move)) {
      const moves = possibleMoves(this);
      this.#move(boardPositionNotationMoveToMove(moves, move));
    } else {
      this.#move(move);
    }
  }

  undo() {
    const previous = this.#history.pop();
    if (previous) {
      this.#state = previous;
    }
  }
}
