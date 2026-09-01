import { configureStore, type Middleware } from "@reduxjs/toolkit";
import { mealReduser, addProduct } from "./mealsSlice";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { db } from "../db";

// Middleware для фонового сохранения данных в IndexedDB
const offlineStorageMiddleware: Middleware =
  (storeApi) => (next) => async (action) => {
    // Сначала даем редьюсеру обновить стейт
    const result = next(action);
    const state = storeApi.getState() as RootState;

    // Если добавился продукт — сохраняем/обновляем этот конкретный день в IndexedDB
    if (addProduct.match(action)) {
      const targetDate = action.payload.date;
      const dayData = state.meal.product.find((p) => p.date === targetDate);
      if (dayData) {
        await db.product.put(dayData); // put обновит запись, если дата совпадает
      }
    }

    // Если изменились цели — сохраняем их под ключом 'current'
    // if (setDailyGoals.match(action)) {
    //   await db.dailyGoals.put({ ...state.meal.dailyGoals, id: 'current' as any });
    // }

    return result;
  };

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
