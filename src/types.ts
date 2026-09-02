export type mealType = "breakfast" | "lunch" | "dinner" | "snack";

export type mealEntry = {
  meal: mealType | null;
  id: string;
  productName: string;
  weight: number;
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
};

export type productType = {
  date: string;
  dailyLimit?: dailyGoalsType;
  items: mealEntry[];
};

export interface BaseProduct {
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export type dailyGoalsType = {
  protein: number;
  fat: number;
  carb: number;
  cals: number;
};

export type deleteProductType = {
  item: mealEntry;
  selectedDate: Date | null;
};
