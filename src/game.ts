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
import { possibleMoves } from "./moves.ts";
import { copyState, State } from "./state.ts";
import { BoardPositionNotationMove } from "./types.ts";
import {
  defaultFen,
  isBoardPositionNotationMove,
  oppositeColor,
} from "./utils.ts";

export class Game {
  #state: State;

  #history: State[] = [];

  constructor() {
    this.#state = fenToState(defaultFen);
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
    // TODO: check for insufficient pieces
    return false;
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
