import { fenToState } from "./fen.ts";
import {
  applyEnPassant,
  applyHalfMoveCount,
  applyMove,
  applyMoveCount,
  Move,
  updateCastling,
} from "./move.ts";
import { copyState, State } from "./state.ts";
import { defaultFen, oppositeColor } from "./utils.ts";

export class Game {
  state: State;

  #history: State[] = [];

  constructor() {
    this.state = fenToState(defaultFen);
  }

  #save() {
    this.#history.push(copyState(this.state));
  }

  load(fen: string) {
    this.state = fenToState(fen);
  }

  move(move: Move) {
    this.#save();

    applyHalfMoveCount(this.state, move);
    applyMoveCount(this.state);
    updateCastling(this.state, move);
    applyMove(this.state, move);
    applyEnPassant(this.state, move);

    this.state.sideToMove = oppositeColor(this.state.sideToMove);
  }

  undo() {
    const previous = this.#history.pop();
    if (previous) {
      this.state = previous;
    }
  }
}
