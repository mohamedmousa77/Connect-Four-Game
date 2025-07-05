import { Injectable } from '@angular/core';
import { Subject, subscribeOn } from 'rxjs';

export type Player = 1 | 2 | null;
export type Cell = Player;

@Injectable({ providedIn: 'root' })

export class GameService {
  readonly ROWS = 6;
  readonly COLS = 7;

  score: { [key: number]: number } = {
    1: 0,
    2: 0
  };

  playerNames: { [key: number]: string } = {
    1: 'Player 1',
    2: 'Player 2'
  };

  board: Cell[][] = [];
  currentPlayer: Player = 1;
  winner: Player = null;
  gameOver = false;
  boardReset$ = new Subject<void>();
  turnChange$ = new Subject<void>();

  isVsCPU = true;
  aiDifficulty: 'easy' | 'hard' = 'easy'; // default
  
  winningCells: { row: number; col: number }[] = [];

  constructor() {
    this.initBoard();
    this.loadFromStorage();
  }
  
  initBoard() {
    this.board = Array(this.ROWS)
      .fill(null)
      .map(() => Array(this.COLS).fill(null));
    this.currentPlayer = 1;
    this.winner = null;
    this.gameOver = false;
    this.boardReset$.next();
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
    this.playSound('assets/sounds/click.mp3');
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][colIndex] === null) {
        this.board[row][colIndex] = this.currentPlayer;
         //? Verifica la vittoria subito dopo aver inserito il disco
        if (this.checkWin(row, colIndex)) {
          this.playSound('assets/sounds/win.mp3');
          this.winner = this.currentPlayer;
          this.gameOver = true;
            if (this.currentPlayer) {
              this.score[this.currentPlayer]++;
              this.saveToStorage(); 
            }
        } else {
          this.switchPlayer();
          // Chiamata alla CPU se è il suo turno
          this.playCPUMove();
        }
        return true;
      }
    }
    return false; // colonna piena
  }

  checkWin(row: number, col: number, player: Player = this.currentPlayer): boolean {
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

  playCPUMove() {
    if (!this.isVsCPU || this.gameOver || this.currentPlayer !== 2) return;
    setTimeout(() => {
      // 1. cerca vittoria
      const winCol = this.findStrategicMove(2);
      if (winCol !== null) {
      this.dropDisc(winCol);
      return;
      }
      // 2. blocca giocatore
      const blockCol = this.findStrategicMove(1);
      
      if (blockCol !== null) {
      this.dropDisc(blockCol);
      return;
      }
      // 3. altrimenti random
      const availableCols = this.getAvailableColumns();
      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      this.dropDisc(randomCol);
    }, 700);
  }

  findStrategicMove(player: Player): number | null {
  const availableCols = this.getAvailableColumns();

  for (const col of availableCols) {
    const row = this.findAvailableRow(col);
    if (row === -1) continue;

    this.board[row][col] = player;
    const isWin = this.checkWin(row, col, player);
    this.board[row][col] = null;

    if (isWin) return col;
  }

  return null;
  }

  findAvailableRow(col: number): number {
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][col] === null) return row;
    }
    return -1;
  }

  getAvailableColumns(): number[] {
    const available: number[] = [];
    for (let c = 0; c < this.COLS; c++) {
      if (this.board[0][c] === null) {
        available.push(c);
      }
    }
    return available;
    }

  // To save in storage
  saveToStorage() {
    localStorage.setItem('connect4_score', JSON.stringify(this.score));
    localStorage.setItem('connect4_names', JSON.stringify(this.playerNames));
  }

  loadFromStorage() {
    const savedScore = localStorage.getItem('connect4_score');
    const savedNames = localStorage.getItem('connect4_names');
    if (savedScore) {
      this.score = JSON.parse(savedScore);
    }
    if (savedNames) {
      this.playerNames = JSON.parse(savedNames);
    }
  }

  // Play Sounds
  playSound(src: string) {
    const audio = new Audio();
    audio.src = src;
    audio.load();
    audio.play();
  }
  }

