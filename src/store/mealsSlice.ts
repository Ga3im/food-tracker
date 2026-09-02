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
  deleteProductType,
} from "../types";
import { products } from "../data";
import { db } from "../db";
import { format } from "date-fns";
import { deleteProductOffline } from ".";

type MealStateType = {
  nutritional: mealEntry;
  product: productType[];
  dailyGoals: dailyGoalsType;
  edittingProduct: mealEntry | null;
  isEdit: boolean;
  isDirectInput: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  selectedDate: null | Date;
  copiedProduct: mealEntry | null;
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
        nutritional: mealEntry;
        meal: mealType | null;
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
        nutritional: mealEntry;
        meal: mealType | null;
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
    copyProduct: (state, action: PayloadAction<mealEntry | null>) => {
      state.copiedProduct = action.payload;
    },

    pasteProduct: (state, action: PayloadAction<mealType>) => {
      const meal = action.payload;
      if (state.copiedProduct) {
        if (state.copiedProduct) {
          state.nutritional = { ...state.copiedProduct };
        } else {
          state.nutritional = {
            meal: meal,
            id: crypto.randomUUID(),
            productName: state.copiedProduct.productName,
            weight: state.copiedProduct.weight,
            proteins: state.copiedProduct.proteins || 0,
            fats: state.copiedProduct.fats || 0,
            carbs: state.copiedProduct.carbs || 0,
            calories: state.copiedProduct.calories || 0,
          };
        }
      }
      state.copiedProduct = null;
    },
    deleteProduct: (state, action: PayloadAction<deleteProductType>) => {
      const { selectedDate, item } = action.payload;
      const date = format(selectedDate, "dd.MM.yy");

      state.product.forEach((p) => {
        if (p.date === date) {
          p.items = p.items.filter((i) => i.id !== item.id);
        }
      });
    },

    setNutritional: (state, action: PayloadAction<mealEntry>) => {
      state.nutritional = action.payload;
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
    setIsDirectInput: (state, action: PayloadAction<boolean>) => {
      state.isDirectInput = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<null | Date>) => {
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
  setNutritional,
  setDailyGoals,
  setEdittingProduct,
  setIsEdit,
  setIsDirectInput,
  setSelectedDate,
} = mealSlice.actions;
export const mealReduser = mealSlice.reducer;
