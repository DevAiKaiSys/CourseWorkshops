import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiServer}/foods`;

  getAll() {
    return this.http
      .get(`${this.apiUrl}/list`, { observe: 'response' })
      .pipe(catchError((error) => of(error)));
  }

  create(payload: any) {
    return this.http
      .post(`${this.apiUrl}/create`, payload, {
        observe: 'response',
      })
      .pipe(
        catchError((error) =>
          of({
            success: false,
            message: 'Failed to save food. Please try again.',
          })
        )
      );
  }

  update(payload: any) {
    return this.http
      .put(`${this.apiUrl}/update`, payload, {
        observe: 'response',
      })
      .pipe(
        catchError((error) =>
          of({
            success: false,
            message: 'Failed to save food. Please try again.',
          })
        )
      );
  }

  remove(id: number) {
    return this.http
      .patch(
        `${this.apiUrl}/remove/${id}`,
        {},
        {
          observe: 'response',
        }
      )
      .pipe(
        catchError((error) =>
          of({
            success: false,
            message: 'Failed to delete food. Please try again.',
          })
        )
      );
  }

  upload(formData: FormData) {
    return this.http
      .post(`${this.apiUrl}/upload`, formData, {
        observe: 'response',
      })
      .pipe(
        catchError((error) =>
          of({
            success: false,
            message: 'Failed to upload file. Please try again.',
          })
        )
      );
  }
}
