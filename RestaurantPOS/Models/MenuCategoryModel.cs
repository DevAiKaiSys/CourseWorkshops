using System;
using RestaurantPOS.Data;

namespace RestaurantPOS.Models;

public class MenuCategoryModel
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Icon { get; set; }

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