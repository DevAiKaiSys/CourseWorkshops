import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  private http = inject(HttpClient);

  username: string = '';
  password: string = '';

  signIn() {
    if (this.username == '' || this.password == '') {
      Swal.fire({
        title: 'ตรวจสอบข้อมูล',
        text: 'โปรดกรอก username หรือ password ด้วย',
        icon: 'error',
      });
    } else {
      const payload = {
        username: this.username,
        password: this.password,
      };

      try {
        this.http
          .post('http://localhost:3000/api/user/signin', payload)
          .pipe(
            catchError((error) => {
              return of({
                ...error,
                success: false,
                message: 'Login failed. Please try again.',
              }); // Return a default error message
            })
          )
          .subscribe((res: any) => {
            console.log('Response status:', res.status);
            console.log('Body:', res.body);
            if (res.status == 200) {
            } else {
              Swal.fire({
                title: 'ตรวจสอบข้อมูล',
                text: 'username invalid',
                icon: 'error',
              });
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
}
