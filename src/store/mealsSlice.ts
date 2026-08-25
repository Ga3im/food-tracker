import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  mealEntry,
  mealType,
  productType,
  dailyGoalsType,
} from "../types";
import { products } from "../data";
import { db } from "../db";

type MealStateType = {
  nutritional: mealEntry;
  product: productType[];
  isSetting: boolean;
  dailyGoals: dailyGoalsType;
  edittingProduct: mealEntry | null; // Сделали nullable
  isEdit: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
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

const initialState: MealStateType = {
  nutritional: initialFormState,
  product: products,
  isSetting: false,
  dailyGoals: { protein: 0, fat: 0, carb: 0, cals: 0 },
  edittingProduct: null,
  isEdit: false,
  status: "idle",
};

export const loadOfflineData = createAsyncThunk(
  "meal/loadOfflineData",
  async () => {
    const offlineProducts = await db.product.toArray();
    const offlineGoals = await db.dailyGoals.get("current");

    return {
      products: offlineProducts.length > 0 ? offlineProducts : null,
      dailyGoals: offlineGoals || null,
    };
  }
);

export const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    addNewProduct: (
      state,
      action: PayloadAction<{
        date: string;
        nutritional: mealEntry;
        meal: mealType | null;
      }>
    ) => {
      const { date, nutritional, meal } = action.payload;

      const calculatedProduct = {
        ...nutritional,
        meal: meal,
        proteins: Number((nutritional.proteins * (0.01 * nutritional.weight)).toFixed(1)),
        fats: Number((nutritional.fats * (0.01 * nutritional.weight)).toFixed(1)),
        carbs: Number((nutritional.carbs * (0.01 * nutritional.weight)).toFixed(1)),
        calories: Math.round(nutritional.calories * (0.01 * nutritional.weight)),
      };

      const dayEntry = state.product.find((p) => p.date === date);

      if (dayEntry) {
        dayEntry.items.push(calculatedProduct);
      } else {
        state.product.push({
          date: date,
          dailyLimit: state.dailyGoals,
          items: [calculatedProduct],
        });
      }
    },
    // ФУНКЦИЯ РЕДАКТИРОВАНИЯ ВНУТРИ ОСНОВНОГО МАССИВА
    updateProduct: (
      state,
      action: PayloadAction<{
        date: string;
        nutritional: mealEntry;
        meal: mealType | null;
      }>
    ) => {
      const { date, nutritional, meal } = action.payload;

      const calculatedProduct = {
        ...nutritional,
        meal: meal,
        proteins: Number((nutritional.proteins * (0.01 * nutritional.weight)).toFixed(1)),
        fats: Number((nutritional.fats * (0.01 * nutritional.weight)).toFixed(1)),
        carbs: Number((nutritional.carbs * (0.01 * nutritional.weight)).toFixed(1)),
        calories: Math.round(nutritional.calories * (0.01 * nutritional.weight)),
      };

      const dayEntry = state.product.find((p) => p.date === date);

      if (dayEntry) {
        const itemIndex = dayEntry.items.findIndex((item) => item.id === nutritional.id);
        if (itemIndex !== -1) {
          dayEntry.items[itemIndex] = calculatedProduct;
        }
      }
    },
    setNutritional: (state, action: PayloadAction<mealEntry>) => {
      state.nutritional = action.payload;
    },
    setIsSetting: (state, action: PayloadAction<boolean>) => {
      state.isSetting = action.payload;
    },
    setDailyGoals: (state, action: PayloadAction<dailyGoalsType>) => {
      state.dailyGoals = action.payload;
    },
    setEdittingProduct: (state, action: PayloadAction<mealEntry | null>) => {
      state.edittingProduct = action.payload;
    },
    setIsEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOfflineData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadOfflineData.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.products) {
          state.product = action.payload.products;
        }
        if (action.payload.dailyGoals) {
          state.dailyGoals = action.payload.dailyGoals;
        }
      })
      .addCase(loadOfflineData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  addNewProduct,
  updateProduct, // Экспортируем новый метод
  setNutritional,
  setIsSetting,
  setDailyGoals,
  setEdittingProduct,
  setIsEdit,
} = mealSlice.actions;
export const mealReduser = mealSlice.reducer;
