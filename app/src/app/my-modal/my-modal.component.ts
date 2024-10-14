import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-modal',
  standalone: true,
  imports: [],
  templateUrl: './my-modal.component.html',
  styleUrl: './my-modal.component.css',
})
export class MyModalComponent {
  @Input({ required: true }) modalId!: string;
  @Input({ required: true }) title!: string;
  @Input() modalSize: string | undefined;
}
