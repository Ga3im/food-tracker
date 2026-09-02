import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store";
import { loadOfflineData } from "../../store/mealsSlice";
import { Route, Routes } from "react-router-dom";
import { routes } from "../../pages/router";
import { MainPage } from "../../pages/MainPage";
import { SettingPage } from "../../pages/SettingPage";
import { Header } from "../Header/Header";
import { MealEntryPage } from "../../pages/MealEntryPage";

export const Main = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.meal);

  useEffect(() => {
    dispatch(loadOfflineData());
  }, [dispatch]);

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
      <Header />
      <Routes>
        <Route index path={routes.main} element={<MainPage />} />
        <Route path={routes.setting} element={<SettingPage />} />
        <Route path={routes.meal} element={<MealEntryPage />} />
      </Routes>
    </>
  );
};
