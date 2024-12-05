using System;
using System.IO;
using System.Threading.Tasks;
using SQLite;

namespace RestaurantPOS.Data;

public class DatabaseService : IAsyncDisposable
{
    private readonly SQLiteAsyncConnection _connection;

    public DatabaseService()
    {
        // %USERPROFILE%\AppData\Local
        var dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "restpos.db3");
        _connection = new SQLiteAsyncConnection(dbPath,
            SQLiteOpenFlags.ReadWrite | SQLiteOpenFlags.Create | SQLiteOpenFlags.SharedCache);
    }

    public async ValueTask DisposeAsync()
    {
        if (_connection != null) await _connection.CloseAsync();
    }

    public async Task InitializeDatabaseAsync()
    {
        _ = await _connection.CreateTableAsync<MenuCategory>();
        _ = await _connection.CreateTableAsync<MenuItem>();
        _ = await _connection.CreateTableAsync<MenuItemCategoryMapping>();
        _ = await _connection.CreateTableAsync<Order>();
        _ = await _connection.CreateTableAsync<OrderItem>();

        await SeedDateAsync();

        // test
        //MenuItem[] result = await GetMenuItemsByCategoryAsync(1);
    }

    private async Task SeedDateAsync()
    {
        var firstCategory = await _connection.Table<MenuCategory>().FirstOrDefaultAsync();
        if (firstCategory != null) return; // database already seeded

        var categories = SeedData.GetMenuCategories();
        var menuItems = SeedData.GetMenuItems();
        var mappings = SeedData.GetMenuItemCategoryMappings();

        _ = await _connection.InsertAllAsync(categories);
        _ = await _connection.InsertAllAsync(menuItems);
        _ = await _connection.InsertAllAsync(mappings);
    }
}