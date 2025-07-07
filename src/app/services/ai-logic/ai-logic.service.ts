import { Injectable } from '@angular/core';
import { Player } from '../../../Models/player-model';

@Injectable({
  providedIn: 'root'
})

export class AiServices {
  readonly ROWS = 6;
  readonly COLS = 7;
  winningCells: { row: number; col: number }[] = [];

  constructor() { }

  playCPUMove(
    board: Player[][],
    currentPlayer: Player,
    isVsCPU: boolean,
    difficulty: string,
    isGameOver: boolean,
    dropDiscFn: (col: number) => void
  ) {
    if (!isVsCPU || isGameOver || currentPlayer !== 2) return;

    setTimeout(() => {
      if (difficulty === 'hard') {
        this.playHardMove(board, dropDiscFn);
      } else {
        this.playEasyMove(board, dropDiscFn);
      }      
    }, 400);
  }

  playEasyMove(board: Player[][], dropDiscFn: (col: number) => void) {
    const winCol = this.findStrategicMove(2, board);
        if (winCol !== null) return dropDiscFn(winCol);

        const blockCol = this.findStrategicMove(1, board);
        if (blockCol !== null) return dropDiscFn(blockCol);

        const availableCols = this.getAvailableColumns(board);
        const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];

        dropDiscFn(randomCol);
  }

  playHardMove(board: Player[][], dropDiscFn: (col: number) => void) {
    const bestMove = this.getBestMove(board, 2); // depth = 2
    if (bestMove !== null) dropDiscFn(bestMove);
  }

  getBestMove(board: Player[][], depth: number): number | null {
    const cols = this.getAvailableColumns(board);
    let bestScore = -Infinity;
    let bestCol = null;

    for (let col of cols) {
      const row = this.findAvailableRow(col, board);
      if (row === -1) continue;

      board[row][col] = 2; // CPU = 2
      const score = this.minimax(board, depth - 1, false);
      board[row][col] = null;

      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }
    }
    return bestCol;
  }

  minimax(board: Player[][], depth: number, isMaximizing: boolean): number {
    if (depth === 0) return this.evaluateBoard(board);

    const cols = this.getAvailableColumns(board);
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let col of cols) {
      const row = this.findAvailableRow(col, board);
      if (row === -1) continue;

      board[row][col] = isMaximizing ? 2 : 1;
      const score = this.minimax(board, depth - 1, !isMaximizing);
      board[row][col] = null;

      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }

    return bestScore;
  }

  evaluateBoard(board: Player[][]): number {
  let score = 0;

  const sequences = this.getAllSequences(board);

  for (const seq of sequences) {
    score += this.evaluateSequence(seq);
  }

  return score;
}

  getAllSequences(board: Player[][]): Player[][] {
    const sequences: Player[][] = [];

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        // orizzontale
        if (c + 3 < this.COLS) {
          sequences.push([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]]);
        }

        // verticale
        if (r + 3 < this.ROWS) {
          sequences.push([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]]);
        }

        // diagonale ↘
        if (r + 3 < this.ROWS && c + 3 < this.COLS) {
          sequences.push([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]]);
        }

        // diagonale ↙
        if (r + 3 < this.ROWS && c - 3 >= 0) {
          sequences.push([board[r][c], board[r+1][c-1], board[r+2][c-2], board[r+3][c-3]]);
        }
      }
    }

  return sequences;
  }

  evaluateSequence(seq: Player[]): number {
    let score = 0;

    const cpuCount = seq.filter(cell => cell === 2).length;
    const playerCount = seq.filter(cell => cell === 1).length;
    const emptyCount = seq.filter(cell => cell === null).length;

    if (cpuCount === 4) score += 10000;
    else if (cpuCount === 3 && emptyCount === 1) score += 100;
    else if (cpuCount === 2 && emptyCount === 2) score += 10;

    if (playerCount === 3 && emptyCount === 1) score -= 100;
    else if (playerCount === 2 && emptyCount === 2) score -= 10;

    return score;
  }


  findStrategicMove(player: Player, board: Player[][] ): number | null {
  const availableCols = this.getAvailableColumns(board);

  for (const col of availableCols) {
    const row = this.findAvailableRow(col, board);
    if (row === -1) continue;

    board[row][col] = player;
    const isWin = this.checkWin(row, col, player, board);
    board[row][col] = null;

    if (isWin) return col;
  }

  return null;
  }

  findAvailableRow(col: number, board:Player[][] ): number {
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (board[row][col] === null) return row;
    }
    return -1;
  }

  getAvailableColumns(board: Player[][]): number[] {
    const available: number[] = [];
    for (let c = 0; c < this.COLS; c++) {
      if (board[0][c] === null) {
        available.push(c);
      }
    }
    return available;
    }

  checkWin(row: number, col: number, player: Player, board:Player[][]): boolean {
  // Direzioni: orizzontale, verticale, diagonale ↘, diagonale ↙
  const directions = [
    { dr: 0, dc: 1 },   // Orizzontale →
    { dr: 1, dc: 0 },   // Verticale ↓
    { dr: 1, dc: 1 },   // Diagonale ↘
    { dr: 1, dc: -1 },  // Diagonale ↙
    ];

  for (let { dr, dc } of directions) {
    let count = 1;

    // Check in avanti
    count += this.countDirection(row, col, dr, dc, player, board);
    // Check indietro
    count += this.countDirection(row, col, -dr, -dc, player, board);

    if (count >= 4) return true;

    const line = [{ row, col }];

    line.push(...this.getConnectedCells(row, col, dr, dc, player, board));
    line.push(...this.getConnectedCells(row, col, -dr, -dc, player, board));

    if (line.length >= 4) {
      this.winningCells = line.slice(0, 4); // salva le prime 4
      return true;
    }
    }
  return false;
  }

  private getConnectedCells(row: number, col: number, dr: number, dc: number, player: Player, board:Player[][]): { row: number; col: number }[] {
  const connected = [];
  let r = row + dr;
  let c = col + dc;

  while (
    r >= 0 && r < this.ROWS &&
    c >= 0 && c < this.COLS &&
    board[r][c] === player
  ) {
    connected.push({ row: r, col: c });
    r += dr;
    c += dc;
    }
  return connected;
  }

  private countDirection(
    row: number,
    col: number,
    dr: number,
    dc: number,
    player: Player,
    board:Player[][]
  ): number {
    let r = row + dr;
    let c = col + dc;
    let count = 0;

    while (
      r >= 0 &&
      r < this.ROWS &&
      c >= 0 &&
      c < this.COLS &&
      board[r][c] === player
    ) {
      count++;
      r += dr;
      c += dc;
    }

    return count;
  }
}
