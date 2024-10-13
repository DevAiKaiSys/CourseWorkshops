import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);

  name: string = '';

  ngOnInit(): void {
    this.name = this.authService.getUsername()!;
    console.log(this.name);
  }
}
