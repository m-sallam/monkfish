import { Board, getEmptyBoard } from "./board.ts";
import { FenParseError } from "./error.ts";
import {
  EMPTY,
  pieceLettersToValueMap,
  pieceValueToLetterMap,
} from "./pieces/utils.ts";

export const fenToBoard = (fenPositionPart: string) => {
  const board = getEmptyBoard();

  const parts = fenPositionPart.split("/").reverse();
  // must be 8 ranks
  if (parts.length !== 8) throw new FenParseError("invalid position part");

  // must contain a white king and a black kina
  if (!fenPositionPart.includes("K") || !fenPositionPart.includes("k")) {
    throw new FenParseError("invalid position part");
  }

  // must exactly contain one white king and one black king
  let alreadyHasAWhiteKing = false;
  let alreadyHasABlackKing = false;
  parts.forEach((row, index) => {
    let fileIndex = 0;
    let rankLength = 0;
    let wasLastCharANumber = false;

    for (let entry = 0; entry < row.length; entry++) {
      const numberRepresentation = Number(row[entry]);

      if (Number.isNaN(numberRepresentation)) {
        wasLastCharANumber = false;
        rankLength += 1;

        if (row[entry] === "k") {
          if (alreadyHasABlackKing) {
            throw new FenParseError("invalid position part");
          }
          alreadyHasABlackKing = true;
        }

        if (row[entry] === "K") {
          if (alreadyHasAWhiteKing) {
            throw new FenParseError("invalid position part");
          }
          alreadyHasAWhiteKing = true;
        }

        const piece = pieceLettersToValueMap[row[entry]];
        if (!piece) throw new FenParseError("invalid position part");

        board[fileIndex + index * 8] = piece;

        fileIndex += 1;
      } else {
        // cannot contain 2 consecutive numbers
        if (wasLastCharANumber) {
          throw new FenParseError("invalid position part");
        }
        wasLastCharANumber = true;
        rankLength += numberRepresentation;
        fileIndex += numberRepresentation;
      }
    }

    if (rankLength < 8) throw new FenParseError("invalid position part");
    if (fileIndex > 8) throw new FenParseError("invalid position part");
  });

  return board;
};

export const boardToFen = (board: Board) => {
  const ranks = [];

  for (let square = 0; square < 64; square += 8) {
    const rank = board.slice(square, square + 8);

    let rankInLetters = "";
    let emptyCount = 0;

    rank.forEach((file, fileIndex) => {
      if (file === EMPTY) emptyCount += 1;
      else {
        rankInLetters += `${emptyCount || ""}${
          pieceValueToLetterMap[board[square + fileIndex]]
        }`;
        emptyCount = 0;
      }
    });

    if (emptyCount) rankInLetters += emptyCount;

    ranks.push(rankInLetters);
  }

  return ranks.reverse().join("/");
};
