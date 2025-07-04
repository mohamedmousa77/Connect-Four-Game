import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-victory-modal',
  imports: [CommonModule],
  templateUrl: './victory-modal.component.html',
  styleUrl: './victory-modal.component.scss'
})
export class VictoryModalComponent {
  @Input() winner: number | null = null;
  @Output() playAgain = new EventEmitter<void>();

  restartGame() {
    this.playAgain.emit();
  }

}
