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
        // var result = await GetMenuItemsByCategoryAsync(1);
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

    public async Task<MenuCategory[]> GetMenuCategoriesAsync()
    {
        return _ = await _connection.Table<MenuCategory>().ToArrayAsync();
    }

    public async Task<MenuItem[]> GetMenuItemsByCategoryAsync(int categoryId)
    {
        var query = @"SELECT * FROM MenuItem AS menu
                     INNER JOIN MenuItemCategoryMapping AS mapping 
                     ON menu.Id = mapping.MenuItemId 
                     WHERE mapping.MenuCategoryId = ?";

        try
        {
            var menuItems = await _connection.QueryAsync<MenuItem>(query, categoryId);
            return menuItems.ToArray();
        }
        catch (Exception ex)
        {
            throw new Exception("An error occurred while retrieving menu items.", ex);
        }
    }
}