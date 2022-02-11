import { Game } from "./game.ts";

const game = new Game();
// game.load("1r4kR/1pq1r1p1/p3p1R1/2p1P3/8/7Q/PPP2P2/2K5 b - - 0 1");
game.load("6k1/8/8/2q5/8/8/6r1/5K2 b - - 0 1");
// game.load("r4k2/ppp2p2/4BQ2/3p3r/P1q1p3/6P1/2P2P1P/R2R2K1 b - - 0 1");
// game.move({ from: "a1", to: "a5" });
// console.log(game.fen());
console.time("getBestMove");
console.log(game.bestMove(6));
// let count = 0;
// for (let x = 0; x < 1000000000; x++) {
//   count += 1;
// }
console.timeEnd("getBestMove");
