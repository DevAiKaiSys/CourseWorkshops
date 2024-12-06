using System.Linq;
using System.Threading.Tasks;
using ReactiveUI;
using RestaurantPOS.Data;
using RestaurantPOS.Models;

namespace RestaurantPOS.ViewModels;

public class MainPageViewModel : ViewModelBase
{
    private readonly DatabaseService _databaseService;

    // private MenuCategory[] _categories = [];
    private MenuCategoryModel[] _categories = [];
    private bool _isInitialized;

    private bool _isLoading;

    private MenuCategoryModel? _selectedCategory;

    public MainPageViewModel(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    // public MenuCategory[] Categories
    // {
    //     get => _categories;
    //     set => this.RaiseAndSetIfChanged(ref _categories, value);
    // }
    public MenuCategoryModel? SelectedCategory
    {
        get => _selectedCategory;
        set => this.RaiseAndSetIfChanged(ref _selectedCategory, value);
    }

    public MenuCategoryModel[] Categories
    {
        get => _categories;
        set => this.RaiseAndSetIfChanged(ref _categories, value);
    }

    public bool IsLoading
    {
        get => _isLoading;
        set => this.RaiseAndSetIfChanged(ref _isLoading, value);
    }

    public async ValueTask InitializeAsync()
    {
        if (_isInitialized) return;

        _isInitialized = true;

        IsLoading = true;

        // Categories = await _databaseService.GetMenuCategoriesAsync();
        Categories = (await _databaseService.GetMenuCategoriesAsync()).Select(MenuCategoryModel.FromEntity).ToArray();

        Categories[0].IsSelected = true;
        SelectedCategory = Categories[0];

        IsLoading = false;
    }
}