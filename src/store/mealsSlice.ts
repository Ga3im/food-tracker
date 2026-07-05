import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { mealEntry, mealType, ProductType } from "../types";
import { products } from "../data";

type MealStateType = {
  nutritional: mealEntry;
  product: ProductType[];
};

export const initialFormState = {
  meal: null,
  id: "",
  productName: "",
  weight: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
  calories: 0,
};

const getTodayDate = () => {
  return new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }); // Вернет "22.04.26"
};

const savedProducts: ProductType[] = JSON.parse(
  localStorage.getItem("products")
);

const initialState: MealStateType = {
  nutritional: initialFormState,
  product: savedProducts ? savedProducts : products,
};

export const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    addNewProduct: (
      state,
      action: PayloadAction<{
        date: string;
        nutritional: mealEntry;
        meal: mealType;
      }>
    ) => {
      const { date, nutritional, meal } = action.payload;

      const calculatedProduct = {
        ...nutritional,
        meal: meal, // Сохраняем тип, чтобы потом фильтровать
        proteins: Math.floor(
          nutritional.proteins * (0.01 * nutritional.weight)
        ),
        fats: Math.floor(nutritional.fats * (0.01 * nutritional.weight)),
        carbs: Math.floor(nutritional.carbs * (0.01 * nutritional.weight)),
        calories: Math.floor(
          nutritional.calories * (0.01 * nutritional.weight)
        ),
      };

      const dayEntry = state.product.find((p) => p.date === date);

      if (dayEntry) {
        dayEntry.items.push(calculatedProduct);
      } else {
        state.product.push({
          date: date,
          items: [calculatedProduct],
        });
      }
      localStorage.setItem("products", JSON.stringify(state.product));
    },
    setNutritional: (state, action) => {
      state.nutritional = action.payload;
    },
  },
});

export const { addNewProduct, setNutritional } = mealSlice.actions;
export const mealReduser = mealSlice.reducer;
