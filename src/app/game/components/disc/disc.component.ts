import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-disc',
  imports: [CommonModule],
  templateUrl: './disc.component.html',
  styleUrl: './disc.component.scss'
})
export class DiscComponent {
  @Input() player: number | null = null;

}
