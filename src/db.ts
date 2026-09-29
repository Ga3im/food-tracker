import Dexie, { type Table } from "dexie";
import type { ProductGroup, DailyGoalsType, BaseProduct } from "./types"; // Импортируем тип BaseProduct

class NutritionDatabase extends Dexie {
  // Определяем таблицы
  product!: Table<ProductGroup, string>; 
  dailyGoals!: Table<DailyGoalsType, string>; 
  foodDatabase!: Table<BaseProduct, string>; // 👈 1. ДОБАВИЛИ ТАБЛИЦУ ЗДЕСЬ

  constructor() {
    super("NutritionDatabase");
    
    // 👈 2. Увеличиваем версию до 2 и описываем новую таблицу
    this.version(2).stores({
      product: "date",
      dailyGoals: "id",
      foodDatabase: "id", // 👈 Индексируем по id продукта
    });
  }
}

export const db = new NutritionDatabase();
