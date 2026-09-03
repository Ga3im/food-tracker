import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  MealEntry,
  MealType,
  ProductGroup,
  DailyGoalsType,
  DeleteProductGroup,
} from "../types";
import { products } from "../data";
import { db } from "../db";
import { format } from "date-fns";
import { deleteProductOffline } from ".";

type MealStateType = {
  nutritional: MealEntry;
  product: ProductGroup[];
  dailyGoals: DailyGoalsType;
  edittingProduct: MealEntry | null;
  isEdit: boolean;
  isDirectInput: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  selectedDate: Date;
  copiedProduct: MealEntry | null;
};

export const initialFormState: MealEntry = {
  meal: "breakfast",
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
  dailyGoals: { protein: 0, fat: 0, carb: 0, cals: 0 },
  edittingProduct: null,
  isEdit: false,
  isDirectInput: false,
  status: "idle",
  selectedDate: new Date(),
  copiedProduct: null,
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
    addProduct: (
      state,
      action: PayloadAction<{
        date: string;
        nutritional: MealEntry;
        meal: MealType;
      }>
    ) => {
      const { date, nutritional, meal } = action.payload;
      const newId = crypto.randomUUID();
      const calculatedProduct = {
        ...nutritional,
        meal: meal,
        id: newId,
        proteins: state.isDirectInput
          ? nutritional.proteins
          : Number(
              (nutritional.proteins * (0.01 * nutritional.weight)).toFixed(1)
            ),
        fats: state.isDirectInput
          ? nutritional.fats
          : Number((nutritional.fats * (0.01 * nutritional.weight)).toFixed(1)),
        carbs: state.isDirectInput
          ? nutritional.carbs
          : Number(
              (nutritional.carbs * (0.01 * nutritional.weight)).toFixed(1)
            ),
        calories: state.isDirectInput
          ? nutritional.calories
          : Math.round(nutritional.calories * (0.01 * nutritional.weight)),
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
    updateProduct: (
      state,
      action: PayloadAction<{
        date: string;
        nutritional: MealEntry;
        meal: MealType;
      }>
    ) => {
      const { date, nutritional, meal } = action.payload;

      const calculatedProduct = {
        ...nutritional,
        meal: meal,
        proteins: state.isDirectInput
          ? nutritional.proteins
          : Number(
              (nutritional.proteins * (0.01 * nutritional.weight)).toFixed(1)
            ),
        fats: state.isDirectInput
          ? nutritional.fats
          : Number((nutritional.fats * (0.01 * nutritional.weight)).toFixed(1)),
        carbs: state.isDirectInput
          ? nutritional.carbs
          : Number(
              (nutritional.carbs * (0.01 * nutritional.weight)).toFixed(1)
            ),
        calories: state.isDirectInput
          ? nutritional.calories
          : Math.round(nutritional.calories * (0.01 * nutritional.weight)),
      };

      const dayEntry = state.product.find((p) => p.date === date);

      if (dayEntry) {
        const itemIndex = dayEntry.items.findIndex(
          (item) => item.id === nutritional.id
        );
        if (itemIndex !== -1) {
          dayEntry.items[itemIndex] = calculatedProduct;
        }
      }
    },
    copyProduct: (state, action: PayloadAction<MealEntry>) => {
      state.copiedProduct = action.payload;
    },
    pasteProduct: (state, action: PayloadAction<MealType>) => {
      const meal = action.payload;
      if (state.copiedProduct) {
        state.nutritional = {
          ...state.copiedProduct,
          meal: meal,
          id: crypto.randomUUID(),
        };
      }
      state.copiedProduct = null;
    },
    deleteProduct: (state, action: PayloadAction<DeleteProductGroup>) => {
      const { selectedDate, item } = action.payload;
      const date = format(selectedDate, "dd.MM.yy");

      state.product.forEach((p) => {
        if (p.date === date) {
          p.items = p.items.filter((i) => i.id !== item.id);
        }
      });
    },
    cancelEdit: (state, action: PayloadAction<MealType>) => {
      state.nutritional = { ...initialFormState, meal: action.payload };
      state.isEdit = false;
    },
    setNutritional: (state, action: PayloadAction<MealEntry>) => {
      state.nutritional = action.payload;
    },
    setDailyGoals: (state, action: PayloadAction<DailyGoalsType>) => {
      state.dailyGoals = action.payload;
    },
    setEdittingProduct: (state, action: PayloadAction<MealEntry | null>) => {
      state.edittingProduct = action.payload;
    },
    setIsEdit: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
    setIsDirectInput: (state, action: PayloadAction<boolean>) => {
      state.isDirectInput = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload;
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
      })
      .addCase(deleteProductOffline.fulfilled, (state, action) => {
        state.product = action.payload;
      });
  },
});

export const {
  addProduct,
  updateProduct,
  copyProduct,
  pasteProduct,
  deleteProduct,
  cancelEdit,
  setNutritional,
  setDailyGoals,
  setEdittingProduct,
  setIsEdit,
  setIsDirectInput,
  setSelectedDate,
} = mealSlice.actions;
export const mealReduser = mealSlice.reducer;
