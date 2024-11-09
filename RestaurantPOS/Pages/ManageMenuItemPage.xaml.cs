using RestaurantPOS.ViewModels;

namespace RestaurantPOS.Pages;

public partial class ManageMenuItemPage : ContentPage
{
    private readonly ManageMenuItemsViewModel _menuItemsViewModel;

    public ManageMenuItemPage(ManageMenuItemsViewModel menuItemsViewModel)
    {
        InitializeComponent();
        _menuItemsViewModel = menuItemsViewModel;
        BindingContext = _menuItemsViewModel;
        InitializeAsync();
    }

    private async void InitializeAsync()
    {
        await _menuItemsViewModel.InitializeAsync();
    }

    private async void CategoriesListControl_OnCategorySelected(Models.MenuCategoryModel category)
    {
        await _menuItemsViewModel.SelectCategoryCommand.ExecuteAsync(category.Id);
    }

    private async void MenuItemsListControl_OnSelectItem(Data.MenuItem menuItem)
    {
        await _menuItemsViewModel.EditMenuItemCommand.ExecuteAsync(menuItem);
    }
}