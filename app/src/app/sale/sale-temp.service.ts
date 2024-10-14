import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleTempService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiServer}/api/saletemps`;

  getAll(userId: number) {
    return this.http
      .get(`${this.apiUrl}/list/${userId}`, { observe: 'response' })
      .pipe(catchError((error) => of(error)));
  }

  getSaleTempDetail(saleTempId: number) {
    return this.http
      .get(`${this.apiUrl}/listsaletempdetail/${saleTempId}`, {
        observe: 'response',
      })
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

  createDetail(payload: any) {
    return this.http
      .post(`${this.apiUrl}/createdetail`, payload, {
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

  clear(userId: number) {
    return this.http
      .delete(`${this.apiUrl}/clear/${userId}`, {
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
      .delete(`${this.apiUrl}/remove/${id}`, {
        observe: 'response',
      })
      .pipe(
        catchError((error) =>
          of({
            success: false,
            message: 'Failed to delete food. Please try again.',
          })
        )
      );
  }

  changeQty(payload: any) {
    return this.http
      .patch(`${this.apiUrl}/changeqty`, payload, {
        observe: 'response',
      })
      .pipe(
        catchError((error) =>
          of({
            success: false,
            message: 'Failed to delete food. Please try again.',
          })
        )
      );
  }

  updatedFoodSize(payload: any) {
    return this.http
      .patch(`${this.apiUrl}/updateFoodSize`, payload, {
        observe: 'response',
      })
      .pipe(
        catchError((error) =>
          of({
            success: false,
            message: 'Failed to delete food. Please try again.',
          })
        )
      );
  }
}
