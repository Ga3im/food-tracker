import { useEffect } from "react";
import { Dashboard } from "../Dashboard/Dashboard";
import { Hedaer } from "../Header/Header";
import { MealEntry } from "../MealEntry/MealEntry";
import { Setting } from "../Setting/Setting";
import { useAppSelector, useAppDispatch } from "../../store";
import { loadOfflineData } from "../../store/mealsSlice";

export const Main = () => {
  const dispatch = useAppDispatch();
  const { nutritional, isSetting, status } = useAppSelector(
    (state) => state.meal
  );

  // Инициализируем загрузку из IndexedDB при монтировании приложения
  useEffect(() => {
    dispatch(loadOfflineData());
  }, [dispatch]);

  // Пока данные грузятся из базы данных смартфона/браузера, можно показать лоадер
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-lg font-medium text-slate-500 animate-pulse">
          Загрузка данных...
        </p>
      </div>
    );
  }

  return (
    <>
      <Hedaer />
      {isSetting ? (
        <Setting />
      ) : nutritional.meal === null ? (
        <Dashboard />
      ) : (
        <MealEntry />
      )}
    </>
  );
};
