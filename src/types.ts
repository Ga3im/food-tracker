export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "";

export type MealEntry = {
  meal: MealType;
  id: string;
  productName: string;
  weight: number | string;
  proteins: number | string;
  carbs: number | string;
  fats: number | string;
  calories: number | string;
};

export type ProductGroup = {
  date: string;
  dailyLimit?: DailyGoalsType;
  items: MealEntry[];
};

export type BaseProduct = {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
};

export type DailyGoalsType = {
  proteins: number;
  fats: number;
  carbs: number;
  calories: number;
};

export type DeleteProductGroup = {
  item: MealEntry;
  selectedDate: Date;
};
