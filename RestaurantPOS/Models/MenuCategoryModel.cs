using System;
using ReactiveUI;
using RestaurantPOS.Data;

namespace RestaurantPOS.Models;

public class MenuCategoryModel : ReactiveObject
{
    private bool _isSelected;
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Icon { get; set; }

    public bool IsSelected
    {
        get => _isSelected;
        set => this.RaiseAndSetIfChanged(ref _isSelected, value);
    }

    public static MenuCategoryModel FromEntity(MenuCategory entity)
    {
        return entity == null
            ? throw new ArgumentNullException(nameof(entity))
            : new MenuCategoryModel
            {
                Id = entity.Id,
                Name = entity.Name,
                Icon = entity.Icon
            };
    }
}