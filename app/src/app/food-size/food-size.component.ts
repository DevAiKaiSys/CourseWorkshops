import { Component, inject, OnInit } from '@angular/core';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { HttpClient } from '@angular/common/http';
import { FoodTypeService } from '../food-type/food-type.service';
import { FormsModule } from '@angular/forms';
import { count } from 'console';
import { FoodSizeService } from './food-size.service';
import Swal from 'sweetalert2';

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
  foodSizes: any[] = [];
  id: number | undefined;
  name: string = '';
  price: number | undefined;
  remark: string = '';
  foodTypeId: number | undefined;

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
    this.foodSizeService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.foodSizes = res.body;
      } else {
        Swal.fire({
          title: 'Error',
          text: res.error.message,
          icon: 'error',
        });
      }
    });
  }

  clearForm() {
    this.name = '';
    this.price = undefined;
    this.remark = '';
    this.id = undefined;
    this.foodTypeId = undefined;
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

  async remove(item: any) {
    // Show confirmation dialog
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
      this.foodSizeService.remove(item.id).subscribe((res: any) => {
        if (res.status === 200) {
          this.fetchData(); // Refresh the list
        } else {
          Swal.fire('Error!', 'Failed to delete the food type.', 'error');
        }
      });
    }
  }

  edit(item: any) {
    this.name = item.name;
    this.price = item.moneyAdded;
    this.remark = item.remark;
    this.id = item.id;
    this.foodTypeId = item.foodTypeId;
  }
}
