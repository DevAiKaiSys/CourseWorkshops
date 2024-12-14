using System;
using System.Globalization;
using Avalonia.Data.Converters;
using Avalonia.Media;

namespace RestaurantPOS.Converters;

public class BooleanToForegroundConverter : IValueConverter
{
    public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is bool isSelected)
            return isSelected ? Brushes.White : Brushes.Maroon; // White when selected, Maroon when not selected
        return Brushes.Maroon; // Default to Maroon
    }

    public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}