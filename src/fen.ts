import { Board, getEmptyBoard, populateColorsPositions } from "./board.ts";
import { FenParseError } from "./error.ts";
import {
  BLACK_KING,
  EMPTY,
  pieceLettersToValueMap,
  pieceValueToLetterMap,
  WHITE_KING,
} from "./pieces/utils.ts";
import { State } from "./state.ts";
import { BoardPositionNotation, Castling, Color, Square } from "./types.ts";
import {
  boardPositionNotationToSquare,
  squareToBoardPositionNotation,
} from "./utils.ts";

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

export const parseFen = (fen: string) => {
  if (typeof fen !== "string") throw new FenParseError("FEN must be a string");
  if (fen.split(" ").length !== 6) throw new FenParseError("missing FEN parts");

  const [
    positions,
    sideToMove,
    castling,
    enPassant,
    halfMoveCounter,
    currentMoveNumber,
  ] = fen.split(" ");

  const positionRegex = /^([pnbrqkPNBRQK1-8]{1,8}\/?){8}\w+$/;
  const noDoubleDigitsRegex = /\d+\d+/;
  if (!positionRegex.test(positions)) {
    throw new FenParseError("invalid position part");
  }
  if (noDoubleDigitsRegex.test(positions)) {
    throw new FenParseError("invalid position part");
  }

  const sideToMoveRegex = /^b|w$/;
  if (!sideToMoveRegex.test(sideToMove)) {
    throw new FenParseError("invalid side to move");
  }

  const castlingRegex = /^(-|K|Q|k|q)+$/;
  if (!castlingRegex.test(castling)) {
    throw new FenParseError("invalid castling");
  }

  const enPassantRegex = /^-|[a-h][3-6]$/;
  if (!enPassantRegex.test(enPassant)) {
    throw new FenParseError("invalid en passant");
  }

  const halfMoveCounterRegex = /^\d+$/;
  if (!halfMoveCounterRegex.test(halfMoveCounter)) {
    throw new FenParseError("invalid half move count");
  }

  const currentMoveNumberRegex = /^\d+$/;
  if (!currentMoveNumberRegex.test(currentMoveNumber)) {
    throw new FenParseError("invalid move count");
  }

  return [
    positions,
    sideToMove,
    castling,
    enPassant,
    halfMoveCounter,
    currentMoveNumber,
  ];
};

export const fenToState = (fen: string): State => {
  const [
    positionsPart,
    sideToMovePart,
    castlingPart,
    enPassantPart,
    halfMoveCounterPart,
    currentMoveNumberPart,
  ] = parseFen(fen);

  const board = fenToBoard(positionsPart);
  const { blackPositions, whitePositions } = populateColorsPositions(board);
  const whiteKingPosition = board.findIndex((piece) =>
    piece === WHITE_KING
  ) as Square;
  const blackKingPosition = board.findIndex((piece) =>
    piece === BLACK_KING
  ) as Square;

  const castling = castlingPart === "-" ? null : castlingPart as Castling;
  const sideToMove = sideToMovePart as Color;
  const enPassant = enPassantPart === "-"
    ? null
    : boardPositionNotationToSquare(enPassantPart as BoardPositionNotation);
  const halfMoveCount = Number(halfMoveCounterPart);
  const moveCount = Number(currentMoveNumberPart);

  return {
    board,
    blackPositions,
    whitePositions,
    kingPosition: [whiteKingPosition, blackKingPosition],
    castling,
    enPassant,
    halfMoveCount,
    moveCount,
    sideToMove,
  };
};

export const stateToFen = (state: State): string => {
  const positions = boardToFen(state.board);
  const sideToMove = state.sideToMove;
  const castling = state.castling || "-";
  const enPassant = state.enPassant
    ? squareToBoardPositionNotation(state.enPassant)
    : "-";
  const halfMoveCount = state.halfMoveCount;
  const moveCount = state.moveCount;

  return `${positions} ${sideToMove} ${castling} ${enPassant} ${halfMoveCount} ${moveCount}`;
};
