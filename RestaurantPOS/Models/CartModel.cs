using CommunityToolkit.Mvvm.ComponentModel;

namespace RestaurantPOS.Models
{
    public partial class CartModel : ObservableObject
    {
        public int ItemId { get; set; }
        public required string Name { get; set; }
        public required string Icon { get; set; }
        public decimal Price { get; set; }
        [ObservableProperty, NotifyPropertyChangedFor(nameof(Amount))]
        public int _quantity;

        public decimal Amount => Price * Quantity;
    }
}
