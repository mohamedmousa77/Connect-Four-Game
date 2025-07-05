import { Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-start-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './start-modal.component.html',
  styleUrl: './start-modal.component.scss'
})
export class StartModalComponent {
  @Output() start = new EventEmitter<any>();

  mode: '2p' | 'cpu' | null = null;
  name1: string = '';
  name2: string = '';
  difficulty: 'easy' | 'hard' = 'easy';

  selectMode(mode: '2p' | 'cpu') {
    this.mode = mode;
  }

  startGame() {
    if (this.mode === '2p' && (!this.name1 || !this.name2)) return;
    if (this.mode === 'cpu' && !this.difficulty) return;

    this.start.emit({
      mode: this.mode,
      name1: this.name1 || 'Player 1',
      name2: this.mode === '2p' ? this.name2 || 'Player 2' : 'Computer',
      difficulty: this.difficulty
    });
  }
}
