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
  // @Output() start = new EventEmitter<any>();
    @Output() start = new EventEmitter<{
    isVsCPU: boolean;
    difficulty: 'easy' | 'hard';
    names: { 1: string; 2: string };
  }>();

    isVsCPU: boolean | null = null;
    difficulty: 'easy' | 'hard' = 'easy';
    names = {
      1: '',
      2: ''
    };

  // mode:  'cpu' | 'two' | null = null;
  // name1: string = '';
  // name2: string = '';
  // difficulty: 'easy' | 'hard' = 'easy';
  onSelectMode(mode: 'cpu' | 'two') {
    this.isVsCPU = mode === 'cpu';
    if (this.isVsCPU) {
      this.names[1] = '';
      this.names[2] = 'Computer';
    } else {
      this.names[2] = '';
    }
  }

  canStart(): boolean {
    return (
      this.isVsCPU !== null &&
      this.names[1].trim() !== '' &&
      (!this.isVsCPU ? this.names[2].trim() !== '' : true)
    );
  }

  startGame() {
    if (this.canStart()) {
      this.start.emit({
        isVsCPU: this.isVsCPU!,
        difficulty: this.difficulty,
        names: { ...this.names }
      });
    }
  }

  // selectMode(mode: '2p' | 'cpu') {
  //   this.mode = mode;
  // }

  // startGame() {
  //   if (this.mode === '2p' && (!this.name1 || !this.name2)) return;
  //   if (this.mode === 'cpu' && !this.difficulty) return;

  //   this.start.emit({
  //     mode: this.mode,
  //     name1: this.name1 || 'Player 1',
  //     name2: this.mode === '2p' ? this.name2 || 'Player 2' : 'Computer',
  //     difficulty: this.difficulty
  //   });
  // }
}
