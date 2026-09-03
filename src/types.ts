export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealEntry = {
  meal: MealType;
  id: string;
  productName: string;
  weight: number;
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
};

export type ProductGroup = {
  date: string;
  dailyLimit?: DailyGoalsType;
  items: MealEntry[];
};

export type BaseProduct = {
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export type DailyGoalsType = {
  protein: number;
  fat: number;
  carb: number;
  cals: number;
};

export type DeleteProductGroup = {
  item: MealEntry;
  selectedDate: Date;
};
