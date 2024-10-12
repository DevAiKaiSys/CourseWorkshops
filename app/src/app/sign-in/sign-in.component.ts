import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [],
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
    }
  }
}
