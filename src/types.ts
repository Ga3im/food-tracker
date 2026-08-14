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

export type dailyGoalsType = {
  protein: number;
  fat: number;
  carb: number;
  cals: number;
};
