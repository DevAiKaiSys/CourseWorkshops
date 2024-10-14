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
  saleTemps: any[] = [];
  tableNo: number | undefined = 1;
  userId: number | undefined;
  amount: number = 0;

  ngOnInit(): void {
    this.fetchData();
    this.userId = this.authService.getUserId() ?? undefined;
    if (this.userId) {
      this.fetchDataSaleTemp();
    }
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

  fetchDataSaleTemp() {
    this.saleTempService.getAll(this.userId!).subscribe((res: any) => {
      if (res.status === 200) {
        this.saleTemps = res.body;

        // Calculate total amount using reduce
        this.amount = this.saleTemps.reduce((sum, item) => {
          return sum + item.qty * item.price;
        }, 0);
      } else {
        Swal.fire({
          title: 'Error',
          text: res.error.message,
          icon: 'error',
        });
      }
    });
  }

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
      if (res.status == 201 || res.status == 200) {
        this.fetchDataSaleTemp();
      }
    });
  }

  async clearAllRow() {
    const result = await Swal.fire({
      title: 'ล้างรายการ',
      text: `คุณต้องการล้างบรายการทั้งหมดใช่หรือไม่`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    });

    // Check the user's response
    if (result.isConfirmed) {
      // If confirmed, update the status to "deleted"
      this.saleTempService.clear(this.userId!).subscribe((res: any) => {
        if (res.status === 200) {
          this.fetchDataSaleTemp(); // Refresh the list
        } else {
          Swal.fire('Error!', 'Failed to delete the food type.', 'error');
        }
      });
    }
  }

  async removeitem(item: any) {
    const result = await Swal.fire({
      title: `ลบ ${item.Food.name}`,
      text: `คุณต้องการลบรายการ "${item.Food.name}" ใช่หรือไม่`,
      icon: 'question',
      showCancelButton: true,
      showConfirmButton: true,
    });

    // Check the user's response
    if (result.isConfirmed) {
      // If confirmed, update the status to "deleted"
      this.saleTempService.remove(item.id).subscribe((res: any) => {
        if (res.status === 200) {
          this.fetchDataSaleTemp(); // Refresh the list
        } else {
          Swal.fire('Error!', 'Failed to delete the food type.', 'error');
        }
      });
    }
  }

  changeQty(item: any, operation: string) {
    const payload = {
      id: item.id,
      operation: operation,
    };
    this.saleTempService.changeQty(payload).subscribe((res: any) => {
      if (res.status === 200) {
        this.fetchDataSaleTemp(); // Refresh the list
      } else {
        // Swal.fire('Error!', 'Failed to delete the food type.', 'error');
      }
    });
  }
}
