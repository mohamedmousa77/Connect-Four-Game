import { Injectable } from '@angular/core';
import { Subject, subscribeOn } from 'rxjs';

export type Player = 1 | 2 | null;
export type Cell = Player;

@Injectable({ providedIn: 'root' })

export class GameService {
  readonly ROWS = 6;
  readonly COLS = 7;

  score = {
    1: 0,
    2: 0
  };

  board: Cell[][] = [];
  currentPlayer: Player = 1;
  winner: Player = null;
  gameOver = false;
  boardReset$ = new Subject<void>();
  turnChange$ = new Subject<void>();
  
  winningCells: { row: number; col: number }[] = [];

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
    this.boardReset$.next();
    
    this.boardReset$.next(); // notifica reset
    this.turnChange$.next(); // resetta anche il timer

    this.winningCells = [];
  }

  getBoard(): Cell[][] {
    return this.board;
  }

  switchPlayer() {
    // console.log('switch player called!');
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    // console.log('current player is:' + this.currentPlayer);
    this.turnChange$.next(); 
  }

  dropDisc(colIndex: number): boolean {
    if (this.gameOver) return false;

    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][colIndex] === null) {
        this.board[row][colIndex] = this.currentPlayer;
         //? Verifica la vittoria subito dopo aver inserito il disco
        if (this.checkWin(row, colIndex)) {
          this.winner = this.currentPlayer;
          this.gameOver = true;
            if (this.currentPlayer) {
              this.score[this.currentPlayer]++;
            }
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

    if (count >= 6) return true;

    const line = [{ row, col }];

    line.push(...this.getConnectedCells(row, col, dr, dc, player));
    line.push(...this.getConnectedCells(row, col, -dr, -dc, player));

    if (line.length >= 4) {
      this.winningCells = line.slice(0, 4); // salva le prime 4
      return true;
    }

  }

  return false;
  }

  private getConnectedCells(row: number, col: number, dr: number, dc: number, player: Player): { row: number; col: number }[] {
  const connected = [];
  let r = row + dr;
  let c = col + dc;

  while (
    r >= 0 && r < this.ROWS &&
    c >= 0 && c < this.COLS &&
    this.board[r][c] === player
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
