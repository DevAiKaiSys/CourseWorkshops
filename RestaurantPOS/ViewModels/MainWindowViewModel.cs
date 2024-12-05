namespace RestaurantPOS.ViewModels;

public class MainWindowViewModel : ViewModelBase
{
    public MainWindowViewModel()
    {
        SidebarViewModel = new SidebarViewModel();
    }

    public SidebarViewModel SidebarViewModel { get; }
}