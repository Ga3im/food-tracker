import Dexie, { type Table } from "dexie";
import type { ProductGroup, DailyGoalsType } from "./types";

class NutritionDatabase extends Dexie {
  // Определяем таблицы в памяти
  product!: Table<ProductGroup, string>; // Ключ — дата (string)
  dailyGoals!: Table<DailyGoalsType, string>; // Ключ — фиксированная строка 'current'

  constructor() {
    super("NutritionDatabase");
    // Описываем схемы (индексируем только ключи, так как мы берем данные целиком)
    this.version(1).stores({
      product: "date",
      dailyGoals: "id",
    });
  }
}

export const db = new NutritionDatabase();
