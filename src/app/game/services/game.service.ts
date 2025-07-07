import { Injectable } from '@angular/core';
import { Subject, subscribeOn } from 'rxjs';
import { Player } from '../../../Models/player-model';
import { AiServices } from './ai-logic/ai-logic.service';
import { StorageService } from './storage/storage.service';


export type Cell = Player;

@Injectable({ providedIn: 'root' })

export class GameService {
  readonly ROWS = 6;
  readonly COLS = 7;

  soundEnabled = true;

  score: { [key: number]: number } = {
    1: 0,
    2: 0
  };

  showTimerFirstPlayer  = true;
  showTimerSecondPlayer = false;

  board: Cell[][] = [];
  currentPlayer: Player = 1;
  winner: Player = null;
  gameOver = false;
  boardReset$ = new Subject<void>();
  turnChange$ = new Subject<void>();

  isVsCPU = true;
  aiDifficulty: 'easy' | 'hard' = 'easy';
  
  winningCells: { row: number; col: number }[] = [];

  boundDropDisc = (col: number) => this.dropDisc(col);

  constructor(public aiService: AiServices, public storageService: StorageService) {
    this.initBoard();
    this.storageService.loadFromStorage(this.score);
    
  }
  
  initBoard() {
    this.board = Array(this.ROWS)
      .fill(null)
      .map(() => Array(this.COLS).fill(null));
    //! Reseting all values to origin
    this.score = { 1: 0, 2: 0 };
    this.currentPlayer = 1;
    this.winner = null;
    this.gameOver = false;
    this.boardReset$.next();
    this.turnChange$.next();
    this.showTimerFirstPlayer = true;
    this.showTimerSecondPlayer = false;

    this.winningCells = [];

    if (this.isVsCPU && this.currentPlayer === 2 as Player) {
    this.showTimerFirstPlayer = false;
    this.showTimerSecondPlayer = true;
    setTimeout(() => {
      this.aiService.playCPUMove(            
            this.board, 
            this.currentPlayer,
            this.isVsCPU, 
            this.aiDifficulty, 
            this.gameOver,
            this.boundDropDisc,
        );
    }, 400);
    }
  }

  getBoard(): Cell[][] {
    return this.board;
  }

  switchPlayer() {
    
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    console.log(`the current player is ${this.currentPlayer}`);
    this.turnChange$.next(); 
    if(this.currentPlayer === 1){
      this.showTimerFirstPlayer =true;
      this.showTimerSecondPlayer =false
    }else {
      this.showTimerSecondPlayer =true;
      this.showTimerFirstPlayer =false;
    }
  }

  dropDisc(colIndex: number): boolean {
    if (this.gameOver) return false;
    this.playSound('click.mp3');
    for (let row = this.ROWS - 1; row >= 0; row--) {
      if (this.board[row][colIndex] === null) {
        this.board[row][colIndex] = this.currentPlayer;
         //? Verifica la vittoria subito dopo aver inserito il disco
        if (this.checkWin(row, colIndex)) {
          this.playSound('win.mp3');
          this.winner = this.currentPlayer;
          this.gameOver = true;
            if (this.currentPlayer) {
              this.score[this.currentPlayer]++;
              this.storageService.saveToStorage(this.score); 
            }
        } else {
          this.switchPlayer();
          // Chiamata alla CPU se è il suo turno          
          this.aiService.playCPUMove(            
            this.board, 
            this.currentPlayer,
            this.isVsCPU, 
            this.aiDifficulty, 
            this.gameOver,
            this.boundDropDisc,
          );
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

  playSound(path: string) {
  if (!this.soundEnabled) return; 
  const audio = new Audio(path);
  audio.volume = 0.4;
  audio.play().catch(err => console.warn('Audio blocked:', err));
  }

}

