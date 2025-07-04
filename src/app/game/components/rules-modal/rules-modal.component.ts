import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-rules-modal',
  imports: [CommonModule],
  templateUrl: './rules-modal.component.html',
  styleUrl: './rules-modal.component.scss'
})
export class RulesModalComponent {
 @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
