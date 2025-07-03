import { Injectable } from '@angular/core';

export type Player = 1 | 2 | null;
export type Cell = Player;

@Injectable({ providedIn: 'root' })

export class GameService {
  readonly ROWS = 6;
  readonly COLS = 7;

  board: Cell[][] = [];
  currentPlayer: Player = 1;

  winner: Player = null;
  gameOver = false;
  constructor() {
    this.initBoard();
  }
  
  initBoard() {
    this.board = Array(this.ROWS)
      .fill(null)
      .map(() => Array(this.COLS).fill(null));
    this.currentPlayer = 1;
    this.winner = null;
    this.gameOver = false;
  }

  getBoard(): Cell[][] {
    return this.board;
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  dropDisc(colIndex: number): boolean {
    if (this.gameOver) return false;

    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][colIndex] === null) {
        this.board[row][colIndex] = this.currentPlayer;
         // Verifica la vittoria subito dopo aver inserito il disco
        if (this.checkWin(row, colIndex)) {
          this.winner = this.currentPlayer;
          this.gameOver = true;
        } else {
          this.switchPlayer();
        }
        return true;
      }
    }
    return false; // colonna piena
  }

  private checkWin(row: number, col: number): boolean {
  const player = this.currentPlayer;

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
    count += this.countDirection(row, col, dr, dc, player);
    // Check indietro
    count += this.countDirection(row, col, -dr, -dc, player);

    if (count >= 4) return true;
  }

  return false;
  }
  private countDirection(
    row: number,
    col: number,
    dr: number,
    dc: number,
    player: Player
  ): number {
    let r = row + dr;
    let c = col + dc;
    let count = 0;

    while (
      r >= 0 &&
      r < this.ROWS &&
      c >= 0 &&
      c < this.COLS &&
      this.board[r][c] === player
    ) {
      count++;
      r += dr;
      c += dc;
    }

    return count;
  }
}
