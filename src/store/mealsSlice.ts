import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { mealEntry, mealType, productType, dailyGoalsType } from "../types";
import { products } from "../data";
import { db } from "../db";

type MealStateType = {
  nutritional: mealEntry;
  product: productType[];
  isSetting: boolean;
  dailyGoals: dailyGoalsType;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // статус загрузки БД
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
  product: products, // стартовые дефолтные продукты, если БД пуста
  isSetting: false,
  dailyGoals: { protein: 0, fat: 0, carb: 0, cals: 0 },
  status: 'idle'
};

// Асинхронный экшен для первоначальной загрузки данных из IndexedDB
export const loadOfflineData = createAsyncThunk("meal/loadOfflineData", async () => {
  const offlineProducts = await db.product.toArray();
  // В IndexedDB мы сохраняли цели под ключом 'current'
  const offlineGoals = await db.dailyGoals.get('current'); 
  
  return {
    products: offlineProducts.length > 0 ? offlineProducts : null,
    dailyGoals: offlineGoals || null
  };
});

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
        proteins: Math.floor(nutritional.proteins * (0.01 * nutritional.weight)),
        fats: Math.floor(nutritional.fats * (0.01 * nutritional.weight)),
        carbs: Math.floor(nutritional.carbs * (0.01 * nutritional.weight)),
        calories: Math.floor(nutritional.calories * (0.01 * nutritional.weight)),
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
      
      // Саму запись в IndexedDB мы перенесем в Middleware (Шаг 3), 
      // чтобы не забивать редьюсер побочными эффектами!
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOfflineData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadOfflineData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.products) {
          state.product = action.payload.products;
        }
        if (action.payload.dailyGoals) {
          state.dailyGoals = action.payload.dailyGoals;
        }
      })
      .addCase(loadOfflineData.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const { addNewProduct, setNutritional, setIsSetting, setDailyGoals } = mealSlice.actions;
export const mealReduser = mealSlice.reducer;
