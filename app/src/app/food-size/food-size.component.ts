import { Component, inject, OnInit } from '@angular/core';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { HttpClient } from '@angular/common/http';
import { FoodTypeService } from '../food-type/food-type.service';

@Component({
  selector: 'app-food-size',
  standalone: true,
  imports: [MyModalComponent],
  templateUrl: './food-size.component.html',
  styleUrl: './food-size.component.css',
})
export class FoodSizeComponent implements OnInit {
  private foodTypeService = inject(FoodTypeService);

  foodTypes = [];

  ngOnInit() {
    this.foodTypeService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.foodTypes = res.body;
        console.log(this.foodTypes);
      }
    });
  }
}
