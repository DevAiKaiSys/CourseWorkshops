import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';
import { MyModalComponent } from '../my-modal/my-modal.component';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [FormsModule, MyModalComponent],
  templateUrl: './food-type.component.html',
  styleUrl: './food-type.component.css',
})
export class FoodTypeComponent implements OnInit {
  private http = inject(HttpClient);

  name: string = '';
  remark: string = '';
  foodTypes: any = [];
  isLoading: boolean = true; // Track loading state

  ngOnInit(): void {
    this.fetchData();
  }

  save() {
    try {
      const payload: { name: string; remark?: string } = {
        name: this.name,
        ...(this.remark && this.remark.trim() ? { remark: this.remark } : {}),
      };
      this.http
        .post(`${environment.apiServer}/foodtypes/create`, payload, {
          observe: 'response',
        })
        .pipe(
          catchError((error) => {
            return of({
              ...error,
              success: false,
              message: 'Failed to save food type. Please try again.', // More meaningful message
            });
          })
        )
        .subscribe((res: any) => {
          if (res.status == 201) {
            this.fetchData();
          }
        });
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
    this.http
      .get(`${environment.apiServer}/foodtypes/list`, { observe: 'response' })
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((res: any) => {
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
      this.http
        .patch(
          `${environment.apiServer}/foodtypes/remove/${item.id}`,
          {},
          {
            observe: 'response',
          }
        )
        .pipe(
          catchError((error) => {
            return of({
              success: false,
              message: 'Failed to delete food type. Please try again.',
            });
          })
        )
        .subscribe((res: any) => {
          if (res.status === 200) {
            this.fetchData(); // Refresh the list
          } else {
            Swal.fire('Error!', 'Failed to delete the food type.', 'error');
          }
        });
    }
  }
}
