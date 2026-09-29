import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MealEntry, MealType, DailyGoalsType, DeleteProductGroup, ProductGroup, BaseProduct } from "../types";
import { format } from "date-fns";
import { addProductToDatabaseOffline, deleteProductOffline, loadOfflineData } from ".";

export const initialFormState: MealEntry = {
  meal: "",
  id: "",
  productName: "",
  weight: "",
  proteins: "",
  fats: "",
  carbs: "",
  calories: "",
};

export type MealStateType = {
  product: MealEntry;
  productsData: ProductGroup[];
  databaseProducts: BaseProduct[] | null;
  dailyGoals: DailyGoalsType;
  editedProduct: MealEntry | null;
  isDirectInput: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  selectedDate: Date;
  copiedProduct: MealEntry | null;
};

const initialState: MealStateType = {
  product: initialFormState,
  editedProduct: null,
  copiedProduct: null,
  productsData: [],
  databaseProducts: null,
  dailyGoals: { proteins: 0, fats: 0, carbs: 0, calories: 0 },
  isDirectInput: false,
  status: "idle",
  selectedDate: new Date(),
};

export const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    addProduct: (
      state,
      action: PayloadAction<{
        date: string;
        product: MealEntry;
      }>
    ) => {
      const { date, product } = action.payload;
      const calculatedProduct = {
        ...product,
        proteins: state.isDirectInput
          ? product.proteins
          : Number((+product.proteins * (0.01 * +product.weight)).toFixed(1)),
        fats: state.isDirectInput ? product.fats : Number((+product.fats * (0.01 * +product.weight)).toFixed(1)),
        carbs: state.isDirectInput ? product.carbs : Number((+product.carbs * (0.01 * +product.weight)).toFixed(1)),
        calories: state.isDirectInput ? product.calories : Math.round(+product.calories * (0.01 * +product.weight)),
      };

      const dayEntry = state.productsData?.find((p) => p.date === date);
      if (dayEntry) {
        dayEntry.items.push(calculatedProduct);
      } else {
        state.productsData.push({
          date: date,
          dailyLimit: state.dailyGoals,
          items: [calculatedProduct],
        });
      }
    },
    updateProduct: (
      state,
      action: PayloadAction<{
        updatedProduct: MealEntry;
        date: string;
      }>
    ) => {
      const { updatedProduct, date } = action.payload;

      const calculatedProduct = {
        ...updatedProduct,
        proteins: state.isDirectInput
          ? updatedProduct.proteins
          : Number((+updatedProduct.proteins * (0.01 * +updatedProduct.weight)).toFixed(1)),
        fats: state.isDirectInput
          ? updatedProduct.fats
          : Number((+updatedProduct.fats * (0.01 * +updatedProduct.weight)).toFixed(1)),
        carbs: state.isDirectInput
          ? updatedProduct.carbs
          : Number((+updatedProduct.carbs * (0.01 * +updatedProduct.weight)).toFixed(1)),
        calories: state.isDirectInput
          ? updatedProduct.calories
          : Math.round(+updatedProduct.calories * (0.01 * +updatedProduct.weight)),
      };

      const dayEntry = state.productsData.find((p) => p.date === date);
      if (dayEntry) {
        const itemIndex = dayEntry.items.findIndex((item) => item.id === updatedProduct.id);
        if (itemIndex !== -1) {
          dayEntry.items[itemIndex] = calculatedProduct;
        }
      }
      state.editedProduct = null;
    },
    copyProduct: (state, action: PayloadAction<MealEntry>) => {
      const copiedProduct = action.payload;
      const proteins = (100 * +copiedProduct.proteins) / +copiedProduct.weight;
      const fats = (100 * +copiedProduct.fats) / +copiedProduct.weight;
      const carbs = (100 * +copiedProduct.carbs) / +copiedProduct.weight;
      const calories = (100 * +copiedProduct.calories) / +copiedProduct.weight;

      state.copiedProduct = {
        ...state.copiedProduct,
        productName: copiedProduct.productName,
        weight: copiedProduct.weight,
        proteins: proteins,
        fats: fats,
        carbs: carbs,
        calories: Math.round(calories),
      };
    },
    pasteProduct: (state, action: PayloadAction<MealType>) => {
      const meal = action.payload;

      state.product = {
        ...state.copiedProduct,
        meal: meal,
        id: crypto.randomUUID(),
      };
      state.copiedProduct = null;
    },
    deleteProduct: (state, action: PayloadAction<DeleteProductGroup>) => {
      const { selectedDate, item } = action.payload;
      const date = format(selectedDate, "dd.MM.yy");
      state.productsData.forEach((p) => {
        if (p.date === date) {
          p.items = p.items.filter((i) => i.id !== item.id);
        }
      });
      state.editedProduct = null;
    },
    cancelEdit: (state) => {
      state.editedProduct = null;
    },
    editProduct: (state, action: PayloadAction<MealEntry>) => {
      const editedProduct = action.payload;

      const calculatedProduct = {
        ...editedProduct,
        proteins: state.isDirectInput
          ? editedProduct.proteins
          : Number(((+editedProduct.proteins * 100) / +editedProduct.weight).toFixed(1)),
        fats: state.isDirectInput
          ? editedProduct.fats
          : Number(((+editedProduct.fats * 100) / +editedProduct.weight).toFixed(1)),
        carbs: state.isDirectInput
          ? editedProduct.carbs
          : Number(((+editedProduct.carbs * 100) / +editedProduct.weight).toFixed(1)),
        calories: state.isDirectInput
          ? editedProduct.calories
          : Math.round((+editedProduct.calories * 100) / +editedProduct.weight),
      };

      state.editedProduct = calculatedProduct;
    },
    setProduct: (state, action: PayloadAction<MealEntry>) => {
      state.product = action.payload;
    },
    setDailyGoals: (state, action: PayloadAction<DailyGoalsType>) => {
      state.dailyGoals = action.payload;
    },
    setEdittingProduct: (state, action: PayloadAction<MealEntry | null>) => {
      state.editedProduct = action.payload;
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
        if (action.payload.products) state.productsData = action.payload.products;
        if (action.payload.dailyGoals) state.dailyGoals = action.payload.dailyGoals;

        // 🌟 Наполняем базу продуктов данными при загрузке приложения
        if ((action.payload as any).foodDatabase) {
          state.databaseProducts = (action.payload as any).foodDatabase;
        }
      })
      .addCase(loadOfflineData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deleteProductOffline.fulfilled, (state, action) => {
        state.productsData = action.payload;
      })
      .addCase(addProductToDatabaseOffline.fulfilled, (state, action) => {
        if (!state.databaseProducts) state.databaseProducts = [];
        state.databaseProducts.push(action.payload);
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
  editProduct,
  setProduct,
  setDailyGoals,
  setEdittingProduct,
  setIsDirectInput,
  setSelectedDate,
} = mealSlice.actions;
export const mealReduser = mealSlice.reducer;
