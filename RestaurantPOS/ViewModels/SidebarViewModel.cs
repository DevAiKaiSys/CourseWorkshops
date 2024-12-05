using System.Collections.Generic;
using System.Reactive;
using ReactiveUI;
using RestaurantPOS.Views;

namespace RestaurantPOS.ViewModels;

public class SidebarViewModel : ViewModelBase
{
    private readonly Dictionary<Route, object?> _pages = new();

    private object _currentPage;

    public SidebarViewModel()
    {
        NavigateCommand = ReactiveCommand.Create<Route>(Navigate);
        Navigate(Route.MainPage); // Default page
    }

    public object CurrentPage
    {
        get => _currentPage;
        set => this.RaiseAndSetIfChanged(ref _currentPage, value);
    }

    public ReactiveCommand<Route, Unit> NavigateCommand { get; }

    private void Navigate(Route route)
    {
        // If the page is already created, reuse it
        if (!_pages.ContainsKey(route))
            _pages[route] = route switch
            {
                Route.MainPage => new MainPage(),
                Route.OrdersPage => new OrdersPage(),
                Route.ManageMenuItemPage => new ManageMenuItemPage(),
                _ => null
            };

        // Set the current page to the cached page
        if (_pages[route] != null) CurrentPage = _pages[route]!;
    }
}