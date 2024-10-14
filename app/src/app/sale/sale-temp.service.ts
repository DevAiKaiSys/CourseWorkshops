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
}
