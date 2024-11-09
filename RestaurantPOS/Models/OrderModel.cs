using RestaurantPOS.Data;

namespace RestaurantPOS.Models
{
    public class OrderModel
    {
        public long Id { get; set; }
        public DateTime OrderDate { get; set; }
        public int TotalItemsCount { get; set; }
        public decimal TotalAmountPaid { get; set; }
        public string? PaymentMode { get; set; } // Cash or Online

        public OrderItem[]? Items { get; set; }
    }
}
