import { Component } from '@angular/core';
import { MyModalComponent } from "../my-modal/my-modal.component";

@Component({
  selector: 'app-food-size',
  standalone: true,
  imports: [MyModalComponent],
  templateUrl: './food-size.component.html',
  styleUrl: './food-size.component.css'
})
export class FoodSizeComponent {

}
