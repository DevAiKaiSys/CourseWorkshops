import { Component, inject, OnInit } from '@angular/core';
import { FoodService } from '../food/food.service';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';
import { SaleTempService } from './sale-temp.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { FoodSizeService } from '../food-size/food-size.service';
import { MyModalComponent } from '../my-modal/my-modal.component';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [FormsModule, MyModalComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
})
export class SaleComponent implements OnInit {
  private foodService = inject(FoodService);
  private foodSizeService = inject(FoodSizeService);
  private authService = inject(AuthService);
  private saleTempService = inject(SaleTempService);

  apiUrl = `${environment.apiServer}/uploads/`;

  foods: any[] = [];
  saleTemps: any[] = [];
  foodSizes: any[] = [];
  tableNo: number | undefined = 1;
  userId: number | undefined;
  amount: number = 0;
  saleTempId: number | undefined;
  tasteId: number | undefined;
  foodName: string | undefined;
  qty: number | undefined;
  saleTempDetails: any[] = [];

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

  fetchDataFoodSizeFilter(foodTypeId: any) {
    this.foodSizeService.getByFoodTypeId(foodTypeId).subscribe((res: any) => {
      if (res.status === 200) {
        this.foodSizes = res.body;
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

        this.computeAmount();
      } else {
        Swal.fire({
          title: 'Error',
          text: res.error.message,
          icon: 'error',
        });
      }
    });
  }

  fetchDataSaleTempDetail(saleTemp: number) {
    this.saleTempService.getSaleTempDetail(saleTemp).subscribe((res: any) => {
      if (res.status === 200) {
        this.saleTempDetails = res.body;

        this.fetchDataSaleTemp();
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

  chooseFoodSize(item: any) {
    let foodTypeId = item.Food.foodTypeId;
    this.saleTempId = item.id;
    this.foodName = item.Food.name;
    this.qty = item.qty;

    this.fetchDataFoodSizeFilter(foodTypeId);

    const payload = {
      foodId: item.foodId,
      qty: item.qty,
      saleTempId: item.id,
    };

    this.saleTempService.createDetail(payload).subscribe((res: any) => {
      if (res.status == 201 || res.status == 200) {
        this.fetchDataSaleTempDetail(this.saleTempId!);
      }
    });
  }

  selectedFoodSize(saleTempDetailId: number, foodSize?: any) {
    const payload = {
      saleTempDetailId,
      foodSizeId: foodSize?.id,
    };
    this.saleTempService.updatedFoodSize(payload).subscribe((res: any) => {
      if (res.status == 201 || res.status == 200) {
        this.fetchDataSaleTempDetail(this.saleTempId!);
      }
    });
  }

  computeAmount() {
    // Calculate total amount using reduce
    this.amount = this.saleTemps.reduce((sum, item) => {
      // Calculate the total for the current item
      const itemTotal = item.qty * item.price;

      // Calculate the total for the SaleTempDetails
      const detailsTotal = item.SaleTempDetails
        ? item.SaleTempDetails.reduce((detailSum: any, detail: any) => {
            return detailSum + (detail.addedMoney || 0); // Add addedMoney, default to 0 if undefined
          }, 0)
        : 0;

      // Return the updated sum including itemTotal and detailsTotal
      return sum + itemTotal + detailsTotal;
    }, 0);
  }
}
