import { Component, inject, OnInit } from '@angular/core';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { HttpClient } from '@angular/common/http';
import { FoodTypeService } from '../food-type/food-type.service';
import { FormsModule } from '@angular/forms';
import { count } from 'console';
import { FoodSizeService } from './food-size.service';

@Component({
  selector: 'app-food-size',
  standalone: true,
  imports: [MyModalComponent, FormsModule],
  templateUrl: './food-size.component.html',
  styleUrl: './food-size.component.css',
})
export class FoodSizeComponent implements OnInit {
  private foodTypeService = inject(FoodTypeService);
  private foodSizeService = inject(FoodSizeService);

  foodTypes: any[] = [];
  id: number | undefined;
  name: string = '';
  price: number | undefined;
  remark: string = '';
  foodTypeId: number = 0;

  ngOnInit() {
    this.fetchDataFoodType();
    this.fetchData();
  }

  fetchDataFoodType() {
    this.foodTypeService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.foodTypes = res.body;
        if (this.foodTypes.length > 0) {
          this.foodTypeId = this.foodTypes[0].id;
        }
      }
    });
  }

  fetchData() {}

  clearForm() {
    this.name = '';
    this.price = undefined;
    this.remark = '';
    this.id = undefined;
  }

  save() {
    const payload = {
      foodTypeId: this.foodTypeId,
      name: this.name,
      ...(this.price !== undefined ? { price: this.price } : {}),
      ...(this.remark && this.remark.trim() ? { remark: this.remark } : {}),
    };

    if (this.id) {
      this.foodSizeService
        .update({ ...payload, id: this.id })
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.fetchData();
            this.clearForm();
          }
        });
    } else {
      this.foodSizeService.create(payload).subscribe((res: any) => {
        if (res.status == 201) {
          this.fetchData();
          this.clearForm();
        }
      });
    }

    document.getElementById('modalFoodSize_btnClose')?.click();
  }
}
