import React, { useEffect, useState } from "react";
import { setNutritional } from "../../store/mealsSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { Form } from "../Form/Form";
import { MealList } from "../MealList/MealList";

export const MealEntry = () => {
  const [activeTab, setActiveTab] = useState<"form" | "list" | "both">("form");
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { nutritional } = useAppSelector((state) => state.meal);

  const dispatch = useAppDispatch();

  const { isDesktop } = useIsDesktop();

  useEffect(() => {
    if (isDesktop) {
      setActiveTab("both");
    } else {
      setActiveTab("form");
    }
  }, [isDesktop]);

  // Логика свайпа
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isDesktop) return;
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (distance > 50) setActiveTab("list"); // Свайп влево
    if (distance < -50) setActiveTab("form"); // Свайп вправо
    setTouchStart(null);
  };

  const BackIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );

  useEffect(() => {
    const id = crypto.randomUUID();
    dispatch(setNutritional({ ...nutritional, id: id }));
  }, []);

  const handleBackClick = () => {
    dispatch(setNutritional({ ...nutritional, meal: null }));
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto px-4 ">
        <div
          onClick={handleBackClick}
          className="p-1 -ml-2 text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          <BackIcon />
          <span className="font-semibold text-sm">Назад</span>
        </div>
        <div className="w-10"></div> {/* Заглушка для симметрии */}
      </div>

      {/* Точки-индикаторы вверху */}
      <div className="flex md:hidden justify-center gap-2">
        <div className="flex justify-center gap-2">
          <div
            onClick={() => setActiveTab("form")}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeTab === "form" ? "w-8 bg-indigo-600" : "w-2 bg-slate-300"
            }`}
          />
          <div
            onClick={() => setActiveTab("list")}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeTab === "list" ? "w-8 bg-indigo-600" : "w-2 bg-slate-300"
            }`}
          />
        </div>
      </div>

      <h2 className="pl-[25px]">
        {(nutritional.meal === "breakfast" && "Завтрак") ||
          (nutritional.meal === "lunch" && "Обед") ||
          (nutritional.meal === "dinner" && "Ужин") ||
          (nutritional.meal === "snack" && "Перекус")}
      </h2>

      {/* Контейнер для анимации сдвига */}
      <div className="transition-transform duration-300">
        {activeTab === "form" && <Form />}
        {activeTab === "list" && <MealList setActiveTab={setActiveTab} />}
      </div>
      {activeTab === "both" && (
        <div className="md:grid md:grid-cols-2">
          <MealList setActiveTab={setActiveTab} />
          <Form />
        </div>
      )}
    </div>
  );
};
