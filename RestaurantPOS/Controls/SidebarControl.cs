using System;
using Avalonia.Controls;
using Avalonia.Interactivity;
using RestaurantPOS.ViewModels;

namespace RestaurantPOS.Controls;

public class SidebarControl : Control
{
    public static readonly RoutedEvent<RoutedEventArgs> ValueChangedEvent =
        RoutedEvent.Register<SidebarViewModel, RoutedEventArgs>(nameof(ValueChanged), RoutingStrategies.Direct);

    public event EventHandler<RoutedEventArgs> ValueChanged
    {
        add => AddHandler(ValueChangedEvent, value);
        remove => RemoveHandler(ValueChangedEvent, value);
    }

    protected virtual void OnValueChanged()
    {
        var args = new RoutedEventArgs(ValueChangedEvent);
        RaiseEvent(args);
    }

    public void OnItemSelected(Route route)
    {
        // Raise the event when an item is selected.
        OnValueChanged();
        // Add code to call the NavigateCommand, passing the selected route.
        var viewModel = DataContext as SidebarViewModel;
        viewModel?.NavigateCommand.Execute(route);
    }
}