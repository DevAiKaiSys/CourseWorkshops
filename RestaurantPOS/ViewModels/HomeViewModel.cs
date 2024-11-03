using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using RestaurantPOS.Data;
using RestaurantPOS.Models;

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
        private MenuCategoryModel? _selectedCategory = null;

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
            }

            IsLoading = false;
        }

        [RelayCommand]
        private void SelectCategory(int categoryId)
        {
            if (SelectedCategory?.Id == categoryId)
            {
                return; // The current category is already selected
            }

            MenuCategoryModel existingSelectedCategory = Categories.First(categoryId => categoryId.IsSelected);
            existingSelectedCategory.IsSelected = false;

            MenuCategoryModel newlySelectedCategory = Categories.First(c => c.Id == categoryId);
            newlySelectedCategory.IsSelected = true;

            SelectedCategory = newlySelectedCategory;

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
    }
}
