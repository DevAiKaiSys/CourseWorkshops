using SQLite;

namespace RestaurantPOS.Data
{
    public class DatabaseService : IAsyncDisposable
    {
        private readonly SQLiteAsyncConnection _connection;
        public DatabaseService()
        {
            string dbPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "restpos.db3");
            _connection = new SQLiteAsyncConnection(dbPath, SQLiteOpenFlags.ReadWrite | SQLiteOpenFlags.Create | SQLiteOpenFlags.SharedCache);

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
            MenuCategory firstCategory = await _connection.Table<MenuCategory>().FirstOrDefaultAsync();
            if (firstCategory != null)
            {
                return; // database already seeded
            }

            List<MenuCategory> categories = SeedData.GetMenuCategories();
            List<MenuItem> menuItems = SeedData.GetMenuItems();
            List<MenuItemCategoryMapping> mappings = SeedData.GetMenuItemCategoryMappings();

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
            string query = @"SELECT * FROM MenuItem AS menu
                     INNER JOIN MenuItemCategoryMapping AS mapping 
                     ON menu.Id = mapping.MenuItemId 
                     WHERE mapping.MenuCategoryId = ?";

            try
            {
                List<MenuItem> menuItems = await _connection.QueryAsync<MenuItem>(query, categoryId);
                return menuItems.ToArray();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving menu items.", ex);
            }
        }

        public async ValueTask DisposeAsync()
        {
            if (_connection != null)
            {
                await _connection.CloseAsync();
            }
        }
    }
}
