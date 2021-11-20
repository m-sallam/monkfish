# Monkfish

a chess engine in typescript for Deno.

Demo: https://monkfish-demo.vercel.app/

**Still a work in progress**

TODO:

- threefold repetition draw
- missing tests
- algebraic notation moves
- AI


# Getting Starting

## for Node
```
npm i monkfish
```
and then
```
import { Game } from 'monkfish'

const game = new Game()

game.move({ from : 'a2', to: 'a3' })

const aiMove = game.bestMove()
game.move(aiMove)
```

## for Deno
```
import { Game } from 'https://deno.land/x/monkfish@0.1.17/mod.ts'

const game = new Game()
```

# API

### `.move(move: MoveObject): void`


```
game.move({ from : 'a2', to: 'a3' }) // move piece on a2 to a3
game.move({ from : 'a7', to: 'a8', promotion: 'Q' }) // move piece on a7 to a8 and promote to queen
```

### `.undo(): void`
undo the last move
```
const game = new Game()
game.move({ from : 'a2', to: 'a3' })
game.fen() // "rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 1 1"
game.undo()
game.fen() // "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
```

### `.sideToMove(): 'w' | 'b'`

```
 const game = new Game()
 game.sideToMove() // 'w'
```

### `.load(fen: string): void`

```
  game.load('rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 1 1')
```

### `.isGameOver(): boolean`

```
 const game = new Game('r1bqkbnr/pppppQ2/2n3p1/7p/2B1P3/8/PPPP1PPP/RNB1K1NR b kq - 0 1')
 game.isGameOver() // true
```
```
  const game = new Game('r2qkb2/p1p2p2/2npbnpr/1p2p2p/2B1P2P/NPP2N1R/P2P1PP1/R1BQK3 b q - 50 30')
  game.isGameOver() // true
```

### `.isInCheck(): boolean`

```
 const game = new Game('r1bqkbnr/pppppQ2/2n3p1/7p/2B1P3/8/PPPP1PPP/RNB1K1NR b kq - 0 1')
 game.isInCheck() // true
```

### `.fen(): string`
```
 const game = new Game()
 game.fen() // "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
```

### `.status(): string`
```
 const game = new Game()
 game.status() // "playing"
```
```
 const game = new Game('r2qkb2/p1p2p2/2npbnpr/1p2p2p/2B1P2P/NPP2N1R/P2P1PP1/R1BQK3 b q - 50 30')
 game.status() // "draw by fifty rule"
```
```
 const game = new Game('r1bqkbnr/pppppQ2/2n3p1/7p/2B1P3/8/PPPP1PPP/RNB1K1NR b kq - 0 1')
 game.status() // "white won by checkmate"
```

### `.pieceOnSquare(square: BoardPositionNotation): string | null`
```
 const game = new Game()
 game.pieceOnSquare('a2') // "P"
 game.pieceOnSquare('b8') // "n"
 game.pieceOnSquare('b4') // null
```

### `.possibleMoves(): BoardPositionNotationMove[]`
get all possible moves for the current side
```
const game = new Game()
game.possibleMove() // [{ from: "b1", to: "c3", promotion: null, piece: "N", castling: null },
  // { from: "b1", to: "a3", promotion: null, piece: "N", castling: null },
  // { from: "g1", to: "h3", promotion: null, piece: "N", castling: null },
  // { from: "g1", to: "f3", promotion: null, piece: "N", castling: null },
  // { from: "a2", to: "a3", promotion: null, piece: "P", castling: null },
  // ...]
```

### `.possibleMovesForPosition(position: BoardPositionNotation): BoardPositionNotationMove[]`
et all possible moves for a certain square
```
const game = new Game()
game.possibleMovesForPosition('b1') // [{ from: "b1", to: "c3", promotion: null, piece: "N", castling: null }, { from: "b1", to: "a3", promotion: null, piece: "N", castling: null }]
```

### `.bestMove(depth: number = 5): BoardPositionNotationMove | null`
try to get the best possible move given a depth to search in
```
const game = new Game()
game.bestMove('b1') // { from: "b1", to: "c3", promotion: null, piece: "N", castling: null }
```
