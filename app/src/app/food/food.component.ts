import { Component, inject, OnInit } from '@angular/core';
import { FoodTypeService } from '../food-type/food-type.service';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { FormsModule } from '@angular/forms';
import { FoodService } from './food.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [MyModalComponent, FormsModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css',
})
export class FoodComponent implements OnInit {
  private foodTypeService = inject(FoodTypeService);
  private foodService = inject(FoodService);

  foodTypeId: number | undefined;
  foodTypes: any[] = [];
  foods: any[] = [];
  name: string = '';
  fileName: string | undefined;
  price: number | undefined;
  remark: string = '';
  foodType: string = 'food';
  id: number | undefined;
  file: File | undefined;

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

  fetchData() {
    this.foodService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.foods = res.body;
      } else {
        Swal.fire({
          title: 'Error',
          text: res.error.message,
          icon: 'error',
        });
      }
    });
  }

  async save() {
    const fileName = await this.uploadFile();

    const payload = {
      foodTypeId: this.foodTypeId,
      foodType: this.foodType,
      name: this.name,
      ...(fileName !== undefined ? { fileName: fileName } : {}),
      ...(this.price !== undefined ? { price: this.price } : {}),
      ...(this.remark && this.remark.trim() ? { remark: this.remark } : {}),
    };

    if (this.id) {
      this.foodService
        .update({ ...payload, id: this.id })
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.fetchData();
            this.clearForm();
          }
        });
    } else {
      this.foodService.create(payload).subscribe((res: any) => {
        if (res.status == 201) {
          this.fetchData();
          this.clearForm();
        }
      });
    }

    document.getElementById('modalFood_btnClose')?.click();
  }

  clearForm() {
    this.name = '';
    this.price = undefined;
    this.remark = '';
    this.id = undefined;
    this.foodTypeId = undefined;
    this.fileName = undefined;
    this.foodType = 'food';
  }

  edit(item: any) {
    throw new Error('Method not implemented.');
  }

  remove(item: any) {
    throw new Error('Method not implemented.');
  }

  fileSelected(file: any) {
    if (file.files != undefined) {
      if (file.files.length > 0) {
        this.file = file.files[0];
      }
    }
  }

  async uploadFile() {
    if (this.file !== undefined) {
      const formData = new FormData();
      formData.append('img', this.file);

      // Log FormData contents
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      const res: any = await firstValueFrom(this.foodService.upload(formData));
      return res.fileName;
    }
  }
}
