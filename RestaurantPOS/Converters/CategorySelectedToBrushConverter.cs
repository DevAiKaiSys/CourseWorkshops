using System;
using System.Globalization;
using Avalonia.Data.Converters;
using Avalonia.Media;

namespace RestaurantPOS.Converters;

public class CategorySelectedToBrushConverter : IValueConverter
{
    public CategorySelectedToBrushConverter()
    {
        // Set default brush to LightWheat fetched from resources
        var lightWheatBrush = App.Current.Resources["LightWheat"] as SolidColorBrush;
        DefaultBrush = lightWheatBrush ?? new SolidColorBrush(Colors.Wheat); // Fallback if resource is not found
    }

    public SolidColorBrush SelectedBrush { get; set; } = new(Colors.Maroon); // When the category is selected

    public SolidColorBrush DefaultBrush { get; set; }

    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        return value is bool isSelected && isSelected ? SelectedBrush : DefaultBrush;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}