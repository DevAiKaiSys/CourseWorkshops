using CommunityToolkit.Mvvm.Input;
using MenuItem = RestaurantPOS.Data.MenuItem;

namespace RestaurantPOS.Controls;

public partial class MenuItemsListControl : ContentView
{
    public MenuItemsListControl()
    {
        InitializeComponent();
    }

    public static readonly BindableProperty ItemsProperty = BindableProperty.Create(nameof(Items), typeof(MenuItem[]), typeof(MenuItemsListControl), Array.Empty<MenuItem>());

    public event Action<MenuItem> OnSelectItem;

    public MenuItem[] Items { get => (MenuItem[])GetValue(ItemsProperty); set => SetValue(ItemsProperty, value); }

    public string ActionIcon { get; set; } = "shopping_bag_regular_24.png";

    public bool IsEditCase { set => ActionIcon = value ? "edit_solid_24.png" : "shopping_bag_regular_24.png"; }

    [RelayCommand]
    private void SelectItem(MenuItem item)
    {
        OnSelectItem?.Invoke(item);
    }
    /*Microsoft.Maui.Controls.Xaml.Diagnostics.BindingDiagnostics: Warning: 'RestaurantPOS.Data.MenuItem, 
     * RestaurantPOS.Data.MenuItem, 
     * RestaurantPOS.Data.MenuItem, 
     * RestaurantPOS.Data.MenuItem, 
     * RestaurantPOS.Data.MenuItem, 
     * RestaurantPOS.Data.MenuItem' 
     * cannot be converted to type 'Microsoft.Maui.Controls.MenuItem[]'*/
}