import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { FoodTypeService } from './food-type.service';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [FormsModule, MyModalComponent],
  templateUrl: './food-type.component.html',
  styleUrl: './food-type.component.css',
})
export class FoodTypeComponent implements OnInit {
  private foodTypeService = inject(FoodTypeService);

  name: string = '';
  remark: string = '';
  id: number | undefined;
  foodTypes: any = [];
  isLoading: boolean = true; // Track loading state

  ngOnInit(): void {
    this.fetchData();
  }

  clearForm() {
    this.name = '';
    this.remark = '';
    this.id = undefined;
  }

  save() {
    try {
      const payload: { name: string; remark?: string } = {
        name: this.name,
        ...(this.remark && this.remark.trim() ? { remark: this.remark } : {}),
      };
      if (this.id) {
        this.foodTypeService
          .update({ ...payload, id: this.id })
          .subscribe((res: any) => {
            if (res.status == 200) {
              this.fetchData();
              this.clearForm();
            }
          });
      } else {
        this.foodTypeService.create(payload).subscribe((res: any) => {
          if (res.status == 201) {
            this.fetchData();
            this.clearForm();
          }
        });
      }

      document.getElementById('modalFoodType_btnClose')?.click();
    } catch (error: any) {
      Swal.fire({
        title: 'error',
        text: error.message,
        icon: 'error',
      });
    }
  }

  fetchData() {
    this.isLoading = true; // Set loading to true
    this.foodTypeService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.foodTypes = res.body;
      } else {
        if (res.error) {
          Swal.fire({
            title: 'Error',
            text: res.error.message,
            icon: 'error',
          });
        }
      }
      this.isLoading = false; // Set loading to false after fetching
    });
  }

  async remove(item: any) {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'ลบรายการ',
      text: `คุณต้องการลบรายการ "${item.name}" ใช่หรือไม่`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    });

    // Check the user's response
    if (result.isConfirmed) {
      // If confirmed, update the status to "deleted"
      this.foodTypeService.remove(item.id).subscribe((res: any) => {
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
    this.remark = item.remark;
    this.id = item.id;
  }
}
