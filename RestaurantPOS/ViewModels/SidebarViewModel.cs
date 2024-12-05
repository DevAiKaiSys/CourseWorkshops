using System.Reactive;
using ReactiveUI;
using RestaurantPOS.Views;

namespace RestaurantPOS.ViewModels;

public class SidebarViewModel : ViewModelBase
{
    private object _currentPage;

    public SidebarViewModel()
    {
        NavigateCommand = ReactiveCommand.Create<Route>(Navigate);
        CurrentPage = new MainPage(); // Default page
    }

    public object CurrentPage
    {
        get => _currentPage;
        set => this.RaiseAndSetIfChanged(ref _currentPage, value);
    }

    public ReactiveCommand<Route, Unit> NavigateCommand { get; }

    private void Navigate(Route name)
    {
        // Navigation logic to change the page
        CurrentPage = name switch
        {
            Route.MainPage => new MainPage(),
            Route.OrdersPage => new OrdersPage(),
            Route.ManageMenuItemPage => new ManageMenuItemPage(),
            _ => CurrentPage
        };
    }
}