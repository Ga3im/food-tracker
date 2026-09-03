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
import type { DeleteProductGroup } from "../types";
import { format } from "date-fns";

// Middleware для фонового сохранения данных в IndexedDB
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

      const dayData = state.meal.product.find((p) => p.date === targetDate);
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
    const currentProducts = state.meal.product;

    const updatedProducts = currentProducts.map((p) => {
      if (p.date === date) {
        return {
          ...p,
          items: p.items.filter((i) => String(i.id) !== String(item.id)),
        };
      }
      return p;
    });

    // ИСПРАВЛЕНО: Находим конкретный измененный день и перезаписываем его в таблице product
    const targetDay = updatedProducts.find((p) => p.date === date);
    if (targetDay) {
      await db.product.put(targetDay);
    }

    return updatedProducts;
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
