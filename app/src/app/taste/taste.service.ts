import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasteService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiServer}/tastes`;

  getAll() {
    return this.http.get(`${this.apiUrl}/list`, { observe: 'response' }).pipe(
      catchError((error) => {
        console.error('Error fetching tastes:', error);
        return of({
          success: false,
          message:
            'Failed to retrieve tastes. Please check your connection and try again.',
        });
      })
    );
  }

  create(payload: any) {
    return this.http
      .post(`${this.apiUrl}/create`, payload, { observe: 'response' })
      .pipe(
        catchError((error) => {
          console.error('Error creating taste:', error);
          return of({
            success: false,
            message:
              'Failed to create taste. Please ensure all required fields are filled and try again.',
          });
        })
      );
  }

  update(payload: any) {
    return this.http
      .put(`${this.apiUrl}/update`, payload, { observe: 'response' })
      .pipe(
        catchError((error) => {
          console.error('Error updating taste:', error);
          return of({
            success: false,
            message:
              'Failed to update taste. Please check the data and try again.',
          });
        })
      );
  }

  remove(id: number) {
    return this.http
      .patch(`${this.apiUrl}/remove/${id}`, {}, { observe: 'response' })
      .pipe(
        catchError((error) => {
          console.error('Error deleting taste:', error);
          return of({
            success: false,
            message:
              'Failed to delete taste. Please try again or check if the taste exists.',
          });
        })
      );
  }
}
