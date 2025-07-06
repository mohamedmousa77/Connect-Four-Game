import { Injectable } from '@angular/core';
import { Player } from '../../../../Models/player-model';

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
    isGameOver: boolean,
    dropDiscFn: (col: number) => void
  ) {
    if (!isVsCPU || isGameOver || currentPlayer !== 2) return;

    setTimeout(() => {
      const winCol = this.findStrategicMove(2, board);
      if (winCol !== null) return dropDiscFn(winCol);

      const blockCol = this.findStrategicMove(1, board);
      if (blockCol !== null) return dropDiscFn(blockCol);

      const availableCols = this.getAvailableColumns(board);
      const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      dropDiscFn(randomCol);
    }, 400);
  }

  // playCPUMove(board: Player[][], currentPlayer: Player, isVsCPU: boolean, isGameOver: boolean, dropDisc: (col: number) => void) {
  //   console.log(`Play computer called. is game over: ${isGameOver}`)
  //   if (!isVsCPU || isGameOver || currentPlayer !== 2) return;
  //   setTimeout(() => {
  //     // 1. cerca vittoria
  //     const winCol = this.findStrategicMove(2, board);
  //     if (winCol !== null) {
  //       dropDisc(winCol);
  //     return;
  //     }
  //     // 2. blocca giocatore
  //     const blockCol = this.findStrategicMove(1,board);
      
  //     if (blockCol !== null) {
  //     dropDisc(blockCol);
  //     return;
  //     }
  //     // 3. altrimenti random
  //     const availableCols = this.getAvailableColumns(board);
  //     const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
  //     dropDisc(randomCol);
  //   }, 400);
  // }

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
