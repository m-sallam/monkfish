import {
  applyEnPassant,
  applyMove,
  applyMoveCount,
  applyNonTakeMoveCount,
  Move,
} from "./move.ts";
import { copyState, fenToState, getEmptyState, State } from "./state.ts";
import { oppositeColor } from "./utils.ts";

export class Game {
  state: State;

  #history: State[] = [];

  constructor() {
    this.state = getEmptyState();
  }

  #save() {
    this.#history.push(copyState(this.state));
  }

  load(fen: string) {
    this.state = fenToState(fen);
  }

  move(move: Move) {
    this.#save();

    applyNonTakeMoveCount(this.state, move);
    applyMoveCount(this.state);
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
