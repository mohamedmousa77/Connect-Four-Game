import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-rules-modal',
  imports: [CommonModule],
  templateUrl: './rules-modal.component.html',
  styleUrl: './rules-modal.component.scss'
})
export class RulesModalComponent {
  @Input() showRules = true;
  @Output() close = new EventEmitter<void>();

  constructor(public gameService: GameService) {}

  onClose() {
  this.gameService.playSound('click.mp3');
  this.close.emit();
  }

  toggleSound() {
    this.gameService.soundEnabled = !this.gameService.soundEnabled;
    this.gameService.playSound('click.mp3');
  }

  get soundLabel(): string {
    return this.gameService.soundEnabled ? 'Deactivate 🔇' : 'Activate 🔊';
  }

  get aiDifficulty(): string {
    const difficulty = this.gameService.aiDifficulty;
    return difficulty === 'hard' ? 'Hard 💡' : 'Easy 😴';
  }
}
