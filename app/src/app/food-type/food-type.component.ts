import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-food-type',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './food-type.component.html',
  styleUrl: './food-type.component.css',
})
export class FoodTypeComponent {
  private http = inject(HttpClient);

  name: string = '';
  remark: string = '';

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
            console.log(res.body);
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
}
