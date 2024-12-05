using System.Threading.Tasks;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Microsoft.Extensions.DependencyInjection;
using RestaurantPOS.Data;
using RestaurantPOS.ViewModels;
using RestaurantPOS.Views;

namespace RestaurantPOS;

public class App : Application
{
    public static ServiceProvider Services { get; private set; }

    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        // If you use CommunityToolkit, line below is needed to remove Avalonia data validation.
        // Without this line you will get duplicate validations from both Avalonia and CT
        // BindingPlugins.DataValidators.RemoveAt(0);

        // Register all the services needed for the application to run
        var collection = new ServiceCollection();
        collection.AddCommonServices();

        // Creates a ServiceProvider containing services from the provided IServiceCollection
        Services = collection.BuildServiceProvider();
        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            desktop.MainWindow = new MainWindow
            {
                DataContext = new MainWindowViewModel()
            };

        SeedDataOnStartAsync();

        base.OnFrameworkInitializationCompleted();
    }

    private async Task SeedDataOnStartAsync()
    {
        var databaseService = Services.GetRequiredService<DatabaseService>();
        await databaseService.InitializeDatabaseAsync();
    }
}

public static class ServiceCollectionExtensions
{
    public static void AddCommonServices(this IServiceCollection collection)
    {
        collection.AddSingleton<DatabaseService>();
        collection.AddSingleton<SidebarViewModel>();
        collection.AddSingleton<MainPageViewModel>();
    }
}