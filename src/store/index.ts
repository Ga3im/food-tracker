import {
  configureStore,
  createAsyncThunk,
  type Middleware,
} from "@reduxjs/toolkit";
import { mealReduser, addProduct, deleteProduct } from "./mealsSlice";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { db } from "../db";
import type { BaseProduct, DeleteProductGroup } from "../types";
import { format } from "date-fns";

const offlineStorageMiddleware: Middleware =
  (storeApi) => (next) => async (action) => {
    const result = next(action);
    const state = storeApi.getState() as RootState;

    // Проверяем, был ли это экшен добавления ИЛИ удаления продукта
    if (addProduct.match(action) || deleteProduct.match(action)) {
      // Для addProduct берем дату из payload, для deleteProduct вычисляем её по выбранной дате
      const targetDate = addProduct.match(action)
        ? action.payload.date
        : format(action.payload.selectedDate, "dd.MM.yy");

      const dayData = state.meal.productsData.find((p) => p.date === targetDate);
      if (dayData) {
        // Сохраняем обновленный день (уже без удаленного продукта) в IndexedDB
        await db.product.put(dayData);
      }
    }

    return result;
  };

export const deleteProductOffline = createAsyncThunk(
  "meal/deleteProductOffline",
  async (payload: DeleteProductGroup, { getState }) => {
    const { selectedDate, item } = payload;
    const date = format(selectedDate, "dd.MM.yy");

    const state = getState() as RootState;
    const currentProducts = state.meal.productsData;

    const updatedProducts = currentProducts.map((p) => {
      if (p.date === date) {
        return {
          ...p,
          items: p.items.filter((i) => String(i.id) !== String(item.id)),
        };
      }
      return p;
    });

    const targetDay = updatedProducts.find((p) => p.date === date);
    if (targetDay) {
      await db.product.put(targetDay);
    }

    return updatedProducts;
  }
);

import { foodDatabase as staticFoodDatabase } from "../data";

export const loadOfflineData = createAsyncThunk(
  "meal/loadOfflineData",
  async () => {
    try {
      const offlineProducts = await db.product.toArray();
      const offlineGoals = await db.dailyGoals.get("current");

      // 1. Пытаемся прочитать данные из IndexedDB
      let offlineFoodDb = await db.foodDatabase.toArray();

      // 2. Находим продукты из статической базы, которых еще нет в оффлайне (по имени)
      const missingStaticProducts = staticFoodDatabase.filter(
        (staticProd) =>
          !offlineFoodDb.some((offProd) => offProd.name === staticProd.name)
      );

      // 3. Используем безопасный bulkPut вместо bulkAdd, чтобы избежать падений из-за ID
      if (missingStaticProducts.length > 0) {
        try {
          await db.foodDatabase.bulkPut(missingStaticProducts);
          offlineFoodDb.push(...missingStaticProducts);
        } catch (dbError) {
          offlineFoodDb = [...offlineFoodDb, ...missingStaticProducts];
        }
      }

      return {
        products: offlineProducts.length > 0 ? offlineProducts : null,
        dailyGoals: offlineGoals || null,
        foodDatabase: offlineFoodDb,
      };
    } catch (globalError: any) {
      return {
        products: null,
        dailyGoals: null,
        foodDatabase: staticFoodDatabase,
      };
    }
  }
);

export const addProductToDatabaseOffline = createAsyncThunk(
  "meal/addProductToDatabaseOffline",
  async (newProduct: BaseProduct, { rejectWithValue }) => {
    try {
      if (!db.foodDatabase) {
        throw new Error("Таблица 'foodDatabase' не объявлена в классе Dexie!");
      }

      await db.foodDatabase.put(newProduct); 

      return newProduct;
    } catch (error: any) {
      console.error("Ошибка при сохранении в IndexedDB:", error);
      return rejectWithValue(error?.message || "Не удалось сохранить продукт");
    }
  }
);


const store = configureStore({
  reducer: {
    meal: mealReduser,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(offlineStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
