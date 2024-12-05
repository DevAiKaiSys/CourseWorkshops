using System.Threading.Tasks;
using ReactiveUI;
using RestaurantPOS.Data;

namespace RestaurantPOS.ViewModels;

public class MainPageViewModel : ViewModelBase
{
    private readonly DatabaseService _databaseService;

    private MenuCategory[] _categories = [];
    private bool _isInitialized;

    private bool _isLoading;

    public MainPageViewModel(DatabaseService databaseService)
    {
        _databaseService = databaseService;
    }

    public MenuCategory[] Categories
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

        Categories = await _databaseService.GetMenuCategoriesAsync();

        IsLoading = false;
    }
}