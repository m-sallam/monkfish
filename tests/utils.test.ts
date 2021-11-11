import { assertEquals } from "../dev_deps.ts";
import { Color, File, Rank, Square } from "../src/types.ts";
import { isSquareOnFile, isSquareOnRank, oppositeColor } from "../src/utils.ts";

const oppositeColorCases = [
  {
    name: "given white",
    color: "w",
    returned: "b",
  },
  {
    name: "given black",
    color: "b",
    returned: "w",
  },
];

const isSquareOnRankCases = [
  {
    name: "given square 0 on rank 0",
    square: 0,
    rank: 0,
    returned: true,
  },
  {
    name: "given square 0 on rank 1",
    square: 0,
    rank: 1,
    returned: false,
  },
  {
    name: "given square 60 on rank 3",
    square: 60,
    rank: 3,
    returned: false,
  },
  {
    name: "given square 63 on rank 7",
    square: 63,
    rank: 7,
    returned: true,
  },
];

const isSquareOnFileCases = [
  {
    name: "given square 0 on file 0",
    square: 0,
    file: 0,
    returned: true,
  },
  {
    name: "given square 0 on file 1",
    square: 0,
    file: 1,
    returned: false,
  },
  {
    name: "given square 60 on file 3",
    square: 60,
    file: 3,
    returned: false,
  },
  {
    name: "given square 63 on file 7",
    square: 63,
    file: 7,
    returned: true,
  },
];

oppositeColorCases.forEach(({ name, color, returned }) => {
  Deno.test({
    name: `oppositeColor: ${name}`,
    fn: () => {
      assertEquals(returned, oppositeColor(color as Color));
    },
  });
});

isSquareOnRankCases.forEach(({ name, square, rank, returned }) => {
  Deno.test({
    name: `isSquareOnRank: ${name}`,
    fn: () => {
      assertEquals(returned, isSquareOnRank(square as Square, rank as Rank));
    },
  });
});

isSquareOnFileCases.forEach(({ name, square, file, returned }) => {
  Deno.test({
    name: `isSquareOnFile: ${name}`,
    fn: () => {
      assertEquals(returned, isSquareOnFile(square as Square, file as File));
    },
  });
});
