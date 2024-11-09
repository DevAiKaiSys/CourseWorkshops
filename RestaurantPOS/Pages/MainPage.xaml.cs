using RestaurantPOS.ViewModels;
using MenuItem = RestaurantPOS.Data.MenuItem;

namespace RestaurantPOS.Pages
{
    public partial class MainPage : ContentPage
    {
        private readonly HomeViewModel _homeViewModel;

        public MainPage(HomeViewModel homeViewModel)
        {
            InitializeComponent();
            _homeViewModel = homeViewModel;
            BindingContext = _homeViewModel;
            Initialize();
        }

        private async void Initialize()
        {
            await _homeViewModel.InitializeAsync();
        }

        private async void CategoriesListControl_OnCategorySelected(Models.MenuCategoryModel category)
        {
            await _homeViewModel.SelectCategoryCommand.ExecuteAsync(category.Id);
        }

        private void MenuItemsListControl_OnSelectItem(MenuItem menuItem)
        {
            _homeViewModel.AddToCartCommand.Execute(menuItem);
        }
    }
}
