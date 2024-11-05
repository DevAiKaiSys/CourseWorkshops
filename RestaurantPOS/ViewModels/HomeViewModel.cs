using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RestaurantPOS.Data;
using RestaurantPOS.Models;
using System.Collections.ObjectModel;
using MenuItem = RestaurantPOS.Data.MenuItem;

namespace RestaurantPOS.ViewModels
{
    public partial class HomeViewModel : ObservableObject
    {
        private readonly DatabaseService _databaseService;

        [ObservableProperty]
        //private MenuCategory[] _categories = [];
        private MenuCategoryModel[] _categories = [];
        //private ObservableCollection<MenuCategoryModel> _categories = [];

        [ObservableProperty]
        private MenuItem[] _menuItems = [];

        [ObservableProperty]
        private MenuCategoryModel? _selectedCategory = null;

        public ObservableCollection<CartModel> CartItems { get; set; } = [];

        [ObservableProperty]
        private bool _isLoading;

        public HomeViewModel(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        private bool _isInitialized;

        public async ValueTask InitializeAsync()
        {
            if (_isInitialized)
            {
                return; // Already Initialized
            }

            _isInitialized = true;

            IsLoading = true;

            //Categories = await _databaseService.GetMenuCategoriesAsync();
            Categories = (await _databaseService.GetMenuCategoriesAsync()).Select(MenuCategoryModel.FromEntity).ToArray();
            //MenuCategory[] menuCategories = await _databaseService.GetMenuCategoriesAsync();
            //Categories = menuCategories?.Select(MenuCategoryModel.FromEntity).ToArray() ?? Array.Empty<MenuCategoryModel>();
            //Categories.Clear();
            //foreach (MenuCategory category in menuCategories)
            //{
            //    Categories.Add(MenuCategoryModel.FromEntity(category));
            //}

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

            // Test loading
            //await Task.Delay(3000);

            MenuItems = await _databaseService.GetMenuItemsByCategoryAsync(SelectedCategory.Id);

            IsLoading = false;

            // generate command
            //SelectCategoryCommand
        }
        //private void SelectCategory(MenuCategoryModel category)
        //{
        //    if (SelectedCategory.Id == category.Id)
        //        return; // The current category is already selected

        //    SelectedCategory.IsSelected = false;

        //    category.IsSelected = true;
        //    SelectedCategory
        //}

        [RelayCommand]
        private void AddToCart(MenuItem menuItem)
        {
            CartModel? cartItem = CartItems.FirstOrDefault(c => c.ItemId == menuItem.Id);
            if (cartItem == null)
            {
                // Item does not exist in the cart
                // Add item to cart
                cartItem = new CartModel
                {
                    ItemId = menuItem.Id,
                    Icon = menuItem.Icon,
                    Name = menuItem.Name,
                    Price = menuItem.Price,
                    Quantity = 1
                };
                CartItems.Add(cartItem);
            }
            else
            {
                // This item exists in cart
                // Increase the quantity for this item in the cart
                cartItem.Quantity++;
            }
        }

        [RelayCommand]
        private void IncreaseQuantity(CartModel cartItem)
        {
            cartItem.Quantity++;
        }

        [RelayCommand]
        private void DecreaseQuantity(CartModel cartItem)
        {
            cartItem.Quantity--;
            if (cartItem.Quantity == 0)
            {
                _ = CartItems.Remove(cartItem);
            }
        }

        [RelayCommand]
        private void RemoveItemFromCart(CartModel cartItem)
        {
            _ = CartItems.Remove(cartItem);
        }
    }
}
