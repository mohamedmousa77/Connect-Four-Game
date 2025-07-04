import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { DiscComponent } from '../disc/disc.component';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-game-board',
  imports: [CommonModule, DiscComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent implements OnInit {
  board: any[][] = [];
  rowIndices: number[] = [];
private sub: Subscription | undefined;

  constructor(public gameService : GameService) {}

   ngOnInit(): void {
    this.board = this.gameService.getBoard();

    this.rowIndices = Array.from({ length: this.board.length }, 
      (_, i) => this.board.length - 1 - i);

       this.sub = this.gameService.boardReset$.subscribe(() => {
      this.board = this.gameService.getBoard();
    });
  }

  isWinningCell(row: number, col: number): boolean {
    return this.gameService.winningCells.some(cell => cell.row === row && cell.col === col);
  }

  onDestroy() {
    this.sub?.unsubscribe();
  }

  handleColumnClick(colIndex: number) {
    this.gameService.dropDisc(colIndex);
  }

  resetGame() {
  this.gameService.initBoard();
  this.board = this.gameService.getBoard();
  }

}
