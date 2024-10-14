import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FoodService } from '../food/food.service';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';
import { SaleTempService } from './sale-temp.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent implements OnInit {
  private foodService = inject(FoodService);
  private authService = inject(AuthService);
  private saleTempService = inject(SaleTempService);

  apiUrl = `${environment.apiServer}/uploads/`;

  foods: any[] = [];
  tableNo: number | undefined;
  userId: number | undefined;
  ngOnInit(): void {
    this.fetchData();
    this.userId = this.authService.getUserId() ?? undefined;
  }

  fetchData() {
    this.foodService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.foods = res.body;
      } else {
        Swal.fire({
          title: 'Error',
          text: res.error.message,
          icon: 'error',
        });
      }
    });
  }

  fetchDataFilterFoodType(foodType: string) {
    this.foodService.getByFoodType(foodType).subscribe((res: any) => {
      if (res.status === 200) {
        this.foods = res.body;
      } else {
        Swal.fire({
          title: 'Error',
          text: res.error.message,
          icon: 'error',
        });
      }
    });
  }

  fetchDataSaleTemp() {}

  filter(foodType?: string) {
    if (foodType) {
      this.fetchDataFilterFoodType(foodType);
    } else {
      this.fetchData();
    }
  }

  saveToSaleTemp(item: any) {
    const payload = {
      qty: 1,
      tableNo: this.tableNo,
      foodId: item.id,
      userId: this.userId,
      price: item.price,
    };

    this.saleTempService.create(payload).subscribe((res: any) => {
      if (res.status == 201) {
        this.fetchDataSaleTemp();
      }
    });
  }
}
