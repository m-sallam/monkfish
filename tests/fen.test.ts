import { fenToBoard } from "../src/fen.ts";
import { getEmptyBoard } from "../src/board.ts";
import { assertEquals, assertThrows } from "../dev_deps.ts";
import { FenParseError } from "../src/error.ts";

const fenToBoardCases = [
  {
    name: "default position",
    positionPart: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    board: getEmptyBoard()
      .fill(-1, 48, 56)
      .fill(-4, 56, 57)
      .fill(-2, 57, 58)
      .fill(-3, 58, 59)
      .fill(-5, 59, 60)
      .fill(-6, 60, 61)
      .fill(-3, 61, 62)
      .fill(-2, 62, 63)
      .fill(-4, 63)
      .fill(1, 8, 16)
      .fill(4, 7, 8)
      .fill(2, 6, 7)
      .fill(3, 5, 6)
      .fill(5, 3, 4)
      .fill(6, 4, 5)
      .fill(3, 2, 3)
      .fill(2, 1, 2)
      .fill(4, 0, 1),
  },
  {
    name: "with an invalid piece",
    positionPart: "Anbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    error: "invalid position part",
  },
  {
    name: "with missing rank",
    positionPart: "pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    error: "invalid position part",
  },
  {
    name: "with missing file",
    positionPart: "nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    error: "invalid position part",
  },
  {
    name: "with 2 consecutive numbers",
    positionPart: "nbqkbnr/pppppppp/44/8/8/8/PPPPPPPP/RNBQKBNR",
    error: "invalid position part",
  },

  {
    name: "without a white king",
    positionPart: "nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQQBNR",
    error: "invalid position part",
  },
  {
    name: "without a black king",
    positionPart: "nbqqbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    error: "invalid position part",
  },
  {
    name: "with 2 black kings",
    positionPart: "nbkkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
    error: "invalid position part",
  },
  {
    name: "with 2 white kings",
    positionPart: "nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBKKBNR",
    error: "invalid position part",
  },
];

fenToBoardCases.forEach(({ name, positionPart, board, error }) => {
  Deno.test({
    name: `fenToBoard: ${name}`,
    fn: () => {
      if (board) {
        assertEquals(board, fenToBoard(positionPart));
      } else if (error) {
        assertThrows(
          () => fenToBoard(positionPart),
          FenParseError,
          "invalid position part",
        );
      }
    },
  });
});
