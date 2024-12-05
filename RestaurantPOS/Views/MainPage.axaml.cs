using Avalonia.Controls;
using Microsoft.Extensions.DependencyInjection;
using RestaurantPOS.ViewModels;

namespace RestaurantPOS.Views;

public partial class MainPage : UserControl
{
    public MainPage()
    {
        InitializeComponent();

        DataContext = App.Services.GetRequiredService<MainPageViewModel>();

        Initialize();
    }

    private async void Initialize()
    {
        if (DataContext is MainPageViewModel viewModel) await viewModel.InitializeAsync();
    }
}