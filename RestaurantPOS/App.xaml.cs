using RestaurantPOS.Data;

namespace RestaurantPOS
{
    public partial class App : Application
    {
        //private readonly DatabaseService _databaseService;

        public App(DatabaseService databaseService)
        {
            InitializeComponent();

            MainPage = new AppShell();
            //_databaseService = databaseService;

            Task.Run(databaseService.InitializeDatabaseAsync)
                .GetAwaiter().GetResult();
        }

        //protected override async void OnStart()
        //{
        //    base.OnStart();
        //    // Initialzie and Seed Database
        //    await _databaseService.InitializeDatabaseAsync();
        //}

        protected override Window CreateWindow(IActivationState? activationState)
        {
            Window window = base.CreateWindow(activationState);

            window.Height = window.MinimumHeight = 760;
            window.Width = window.MinimumWidth = 1200;

            return window;
        }
    }
}
