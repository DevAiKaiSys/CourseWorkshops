using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Mvvm.ComponentModel;
using RestaurantPOS.Data;
using RestaurantPOS.Models;

namespace RestaurantPOS.ViewModels
{
    public partial class OrderViewModel : ObservableObject
    {
        private readonly DatabaseService _databaseService;

        public OrderViewModel(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }


        // Return truer if the order creation was successfull, false otherwise
        public async Task<bool> PlaceOrderAsync(CartModel[] cartItems, bool isPaidOnline)
        {
            OrderItem[] orderItems = cartItems.Select(c => new OrderItem
            {
                Icon = c.Icon,
                ItemId = c.ItemId,
                Name = c.Name,
                Price = c.Price,
                Quantity = c.Quantity,
            }).ToArray();

            OrderModel orderModel = new()
            {
                OrderDate = DateTime.Now,
                PaymentMode = isPaidOnline ? "Online" : "Cash",
                TotalAmountPaid = cartItems.Sum(c => c.Amount),
                TotalItemsCount = cartItems.Length,
                Items = orderItems
            };

            string? errorMessage = await _databaseService.PlaceOrderAsync(orderModel);
            if (!string.IsNullOrEmpty(errorMessage))
            {
                // Order creation failed
                await Shell.Current.DisplayAlert("Error", errorMessage, "Ok");
                return false;
            }
            // Order Creation was successfull
            await Toast.Make("Order placed successfully").Show();
            return true;
        }
    }
}