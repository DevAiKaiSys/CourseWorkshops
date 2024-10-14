import { Component, inject, OnInit } from '@angular/core';
import { FoodTypeService } from '../food-type/food-type.service';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { FormsModule } from '@angular/forms';
import { FoodService } from './food.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { environment } from '@environments/environment';

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

  apiUrl = `${environment.apiServer}/uploads/`;

  foodTypeId: number | undefined;
  foodTypes: any[] = [];
  foods: any[] = [];
  name: string = '';
  img: string | undefined;
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

  fetchDataFilterFoodType(foodType: string) {
    this.foodService.getByFoodType(foodType).subscribe((res: any) => {
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

    console.log(payload);

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
    this.img = undefined;
    this.foodType = 'food';
    this.file = undefined;
  }

  edit(item: any) {
    this.name = item.name;
    this.price = item.price;
    this.remark = item.remark;
    this.id = item.id;
    this.foodTypeId = item.foodTypeId;
    this.img = item.img;
    this.foodType = item.foodType;
  }

  async remove(item: any) {
    const result = await Swal.fire({
      title: 'ลบรายการ',
      text: `คุณต้องการลบรายการ "${item.FoodType.name} - ${item.name}" ใช่หรือไม่`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    });

    // Check the user's response
    if (result.isConfirmed) {
      // If confirmed, update the status to "deleted"
      this.foodService.remove(item.id).subscribe((res: any) => {
        if (res.status === 200) {
          this.fetchData(); // Refresh the list
        } else {
          Swal.fire('Error!', 'Failed to delete the food type.', 'error');
        }
      });
    }
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
      return res.body.fileName;
    }
  }

  filter(foodType?: string) {
    if (foodType) {
      this.fetchDataFilterFoodType(foodType);
    } else {
      this.fetchData();
    }
  }
}
