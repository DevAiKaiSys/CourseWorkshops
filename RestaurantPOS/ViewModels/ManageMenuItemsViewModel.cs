using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RestaurantPOS.Data;
using RestaurantPOS.Models;
using MenuItem = RestaurantPOS.Data.MenuItem;

namespace RestaurantPOS.ViewModels
{
    public partial class ManageMenuItemsViewModel : ObservableObject
    {
        private readonly DatabaseService _databaseService;

        public ManageMenuItemsViewModel(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [ObservableProperty]
        private MenuCategoryModel[] _categories = [];

        [ObservableProperty]
        private MenuItem[] _menuItems = [];

        [ObservableProperty]
        private MenuCategoryModel? _selectedCategory = null;

        [ObservableProperty]
        private bool _isLoading;


        private bool _isInitialized;

        public async ValueTask InitializeAsync()
        {
            if (_isInitialized)
            {
                return; // Already Initialized
            }

            _isInitialized = true;

            IsLoading = true;

            Categories = (await _databaseService.GetMenuCategoriesAsync()).Select(MenuCategoryModel.FromEntity).ToArray();

            if (Categories.Length > 0)
            {
                Categories[0].IsSelected = true;
                SelectedCategory = Categories[0];

                MenuItems = await _databaseService.GetMenuItemsByCategoryAsync(SelectedCategory.Id);
            }

            IsLoading = false;
        }


        [RelayCommand]
        private async Task SelectCategoryAsync(int categoryId)
        {
            if (SelectedCategory?.Id == categoryId)
            {
                return; // The current category is already selected
            }

            IsLoading = true;

            MenuCategoryModel existingSelectedCategory = Categories.First(categoryId => categoryId.IsSelected);
            existingSelectedCategory.IsSelected = false;

            MenuCategoryModel newlySelectedCategory = Categories.First(c => c.Id == categoryId);
            newlySelectedCategory.IsSelected = true;

            SelectedCategory = newlySelectedCategory;

            MenuItems = await _databaseService.GetMenuItemsByCategoryAsync(SelectedCategory.Id);

            IsLoading = false;
        }

        [RelayCommand]
        private async Task EditMenuItem(MenuItem menuItem)
        {
            await Shell.Current.DisplayAlert("Edit", "Edit menu item", "Ok");
        }
    }
}
