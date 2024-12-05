using System;
using System.Globalization;
using Avalonia.Controls;
using Avalonia.Data.Converters;
using Avalonia.Media;
using RestaurantPOS.ViewModels;

namespace RestaurantPOS.Converters;

public class RouteToActiveBackgroundConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is UserControl currentPage && parameter is Route page)
            return currentPage.GetType().Name == page.ToString()
                ? Brushes.LightBlue
                : Brushes.Transparent;

        return Brushes.Transparent;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}