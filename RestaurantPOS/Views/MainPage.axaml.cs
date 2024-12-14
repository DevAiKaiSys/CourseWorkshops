using System;
using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.ReactiveUI;
using Microsoft.Extensions.DependencyInjection;
using RestaurantPOS.Models;
using RestaurantPOS.ViewModels;

namespace RestaurantPOS.Views;

public partial class MainPage : ReactiveUserControl<MainPageViewModel>
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

    private void Border_PointerPressed(object sender, PointerPressedEventArgs e)
    {
        if (sender is Border border && border.DataContext is MenuCategoryModel category)
        {
            var categoryId = category.Id;

            if (DataContext is MainPageViewModel viewModel)
                viewModel.SelectCategoryCommand.Execute(categoryId).Subscribe();
        }
    }
}