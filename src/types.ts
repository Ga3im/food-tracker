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

export type ProductType = {
  date: string;
  items: mealEntry[];
};
