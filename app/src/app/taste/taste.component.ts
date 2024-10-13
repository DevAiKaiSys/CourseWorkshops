import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FoodTypeService } from '../food-type/food-type.service';
import { TasteService } from './taste.service';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-taste',
  standalone: true,
  imports: [MyModalComponent, FormsModule],
  templateUrl: './taste.component.html',
  styleUrl: './taste.component.css',
})
export class TasteComponent implements OnInit {
  private foodTypeService = inject(FoodTypeService);
  private tasteService = inject(TasteService);

  foodTypes: any[] = [];
  tastes: any[] = [];
  id: number | undefined;
  name: string = '';
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
    this.tasteService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.tastes = res.body;
      } else {
        Swal.fire({
          title: 'Error',
          text: res.error.message,
          icon: 'error',
        });
      }
    });
  }

  save() {
    const payload = {
      foodTypeId: this.foodTypeId,
      name: this.name,
      ...(this.remark && this.remark.trim() ? { remark: this.remark } : {}),
    };

    if (this.id) {
      this.tasteService
        .update({ ...payload, id: this.id })
        .subscribe((res: any) => {
          if (res.status == 200) {
            this.fetchData();
            this.clearForm();
          }
        });
    } else {
      this.tasteService.create(payload).subscribe((res: any) => {
        if (res.status == 201) {
          this.fetchData();
          this.clearForm();
        }
      });
    }

    document.getElementById('modalTaste_btnClose')?.click();
  }
  remove(_t15: any) {
    throw new Error('Method not implemented.');
  }
  edit(_t15: any) {
    throw new Error('Method not implemented.');
  }
  clearForm() {
    this.name = '';
    this.remark = '';
    this.id = undefined;
    this.foodTypeId = undefined;
  }
}
