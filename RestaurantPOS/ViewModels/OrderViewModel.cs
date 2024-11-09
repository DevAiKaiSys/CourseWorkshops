using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RestaurantPOS.Data;
using RestaurantPOS.Models;
using System.Collections.ObjectModel;

namespace RestaurantPOS.ViewModels
{
    public partial class OrderViewModel : ObservableObject
    {
        private readonly DatabaseService _databaseService;

        public OrderViewModel(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        //public ObservableCollection<Order> Orders { get; set; } = [];
        public ObservableCollection<OrderModel> Orders { get; set; } = [];

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
            Orders.Add(orderModel);
            await Toast.Make("Order placed successfully").Show();
            return true;
        }

        private bool _isInitialized;

        [ObservableProperty]
        private bool _isLoading;

        public async Task InitializeAsync()
        {
            if (_isInitialized)
            {
                return;
            }

            _isInitialized = true;
            IsLoading = true;

            //Order[] orders = await _databaseService.GetOrdersAsync();
            Order[] dbOrders = await _databaseService.GetOrdersAsync();
            OrderModel[] orders = dbOrders.Select(o => new OrderModel
            {
                Id = o.Id,
                OrderDate = DateTime.Now,
                PaymentMode = o.PaymentMode,
                TotalAmountPaid = o.TotalAmountPaid,
                TotalItemsCount = o.TotalItemsCount,
            }).ToArray();
            //foreach (Order order in orders)
            foreach (OrderModel order in orders)
            {
                Orders.Add(order);
            }
            IsLoading = false;
        }

        [ObservableProperty]
        private OrderItem[] _orderItems = [];

        [RelayCommand]
        //private async Task SelectOrderAsync(Order? order)
        private async Task SelectOrderAsync(OrderModel? order)
        {
            OrderModel? preSelectedOrder = Orders.FirstOrDefault(o => o.IsSelected);
            if (preSelectedOrder != null)
            {
                preSelectedOrder.IsSelected = false;
                if (preSelectedOrder.Id == order?.Id)
                {
                    OrderItems = [];
                    return;
                }
            }
            if (order == null || order.Id == 0)
            {
                OrderItems = [];
                return;
            }
            IsLoading = true;
            order.IsSelected = true;
            OrderItems = await _databaseService.GetOrderItemsAsync(order.Id);
            IsLoading = false;
        }
    }
}