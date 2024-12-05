using System;
using System.Globalization;
using Avalonia.Data.Converters;
using RestaurantPOS.Helpers;

namespace RestaurantPOS.Converters;

public class IconPathConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is string iconPath)
            return ImageHelper.LoadFromResource(new Uri("avares://RestaurantPOS/Assets/" + iconPath));
        return null;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}