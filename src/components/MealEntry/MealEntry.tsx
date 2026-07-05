import React, { useEffect, useState } from "react";
import {
  addNewProduct,
  initialFormState,
  setNutritional,
} from "../../store/mealsSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { format } from "date-fns";
import type { mealEntry } from "../../types";

type macronutrientsType = {
  id: number;
  name: string;
  nameEN: string;
};

export const macronutrients: macronutrientsType[] = [
  { id: 1, name: "Белки", nameEN: "proteins" },
  { id: 2, name: "Жиры", nameEN: "fats" },
  { id: 3, name: "Углеводы", nameEN: "carbs" },
];

export const MealEntry = () => {
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  const { product, nutritional } = useAppSelector((state) => state.meal);

  const selectedDate = new Date(); // Или бери из стора, если нужно за другой день

  // 1. Ищем данные за нужный день
  const dateKey = format(selectedDate, "dd.MM.yy");
  const dayData = product.find((p) => p.date === dateKey);

  // 2. Фильтруем только те продукты, которые относятся к текущей странице (например, только завтраки)
  const filteredItems =
    dayData?.items.filter((item) => item.meal === nutritional.meal) || [];

  const dispatch = useAppDispatch();

  // Логика свайпа
  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
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

  const updateNutritional = (key: string, value: string | number) => {
    dispatch(setNutritional({ ...nutritional, [key]: value }));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Валидация (минимум - название продукта)

    // Форматируем текущую дату под формат в сторе "23.04.26"
    const dateStr = format(selectedDate, "dd.MM.yy");
    if (nutritional.productName === "" || nutritional.weight <= 0) {
      setError(true);
    } else {
      setError(false);

      // Отправляем всё одним объектом
      dispatch(
        addNewProduct({
          date: dateStr,
          meal: nutritional.meal,
          nutritional: nutritional,
        })
      );
      // Очистка формы после отправки
      const meal = nutritional.meal;
      dispatch(setNutritional({ ...initialFormState, meal: meal }));
    }
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

      <div className="flex md:hidden justify-center gap-2 py-2">
        <div className="flex justify-center gap-2 py-2">
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
      <div
        className="flex md:grid md:grid-cols-2 md:gap-6 transition-transform duration-300 ease-out md:translate-x-0"
        style={{
          // Сдвиг работает ТОЛЬКО на мобилках (экраны меньше 768px)
          transform:
            window.innerWidth < 768
              ? activeTab === "form"
                ? "translateX(0%)"
                : "translateX(-100%)"
              : "none",
        }}
      >
        {/* ВКЛАДКА 1: ФОРМА */}
        <div className="min-w-full md:min-w-full px-4">
          <div className="min-w-full px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Тот самый синий заголовок */}
              <div className="p-6 bg-indigo-600">
                <h1 className="text-xl font-bold text-white">
                  Добавить продукт
                </h1>
                <p className="text-indigo-100 text-sm">
                  Введите данные продукта
                </p>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    Название продукта
                  </label>
                  <input
                    value={nutritional.productName || ""}
                    onChange={(e) =>
                      updateNutritional("productName", e.target.value)
                    }
                    placeholder="Название продукта"
                    className={
                      error
                        ? "w-full bg-slate-50 border border-[red] rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                        : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    Масса (г)
                  </label>
                  <input
                    step="any"
                    value={nutritional.weight || ""}
                    onChange={(e) =>
                      updateNutritional("weight", Number(e.target.value))
                    }
                    min={0}
                    type="number"
                    placeholder="100"
                    className={
                      error
                        ? "w-full bg-slate-50 border border-[red] rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                        : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                    }
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {macronutrients.map((mn) => (
                    <div key={mn.id}>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 ml-1">
                        {mn.name} за 100 гр
                      </label>
                      <input
                        value={nutritional[mn.nameEN as keyof mealEntry] || ""}
                        onChange={(e) =>
                          updateNutritional(mn.nameEN, Number(e.target.value))
                        }
                        step="any"
                        type="number"
                        min={0}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                    Калорийность (ккал) за 100 гр
                  </label>
                  <div className="relative">
                    <input
                      value={nutritional.calories || ""}
                      onChange={(e) =>
                        updateNutritional("calories", Number(e.target.value))
                      }
                      step="any"
                      min={0}
                      type="number"
                      placeholder="0"
                      className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-4 outline-none focus:border-indigo-500 text-2xl font-bold text-indigo-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 font-medium">
                      kcal
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={
                    error
                      ? "w-full bg-slate-900 border-2 border-[red] text-[red] py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                      : "w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  }
                >
                  Добавить
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ВКЛАДКА 2: СПИСОК */}
        <div className="min-w-full md:min-w-full px-4 md:mt-0 mt-6">
          <div className="min-w-full px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
              <h2 className="text-xl font-bold text-slate-800 mb-4 capitalize">
                {nutritional.meal === "breakfast"
                  ? "Ваш завтрак"
                  : nutritional.meal === "lunch"
                  ? "Ваш обед"
                  : nutritional.meal === "dinner"
                  ? "Ваш ужин"
                  : "Перекусы"}
              </h2>

              {filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-2xl">
                    🥗
                  </div>
                  <p className="text-sm">В этой категории пока пусто</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-slate-50 pb-3 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-800">
                          {item.productName}
                        </span>
                        <span className="font-black text-indigo-600">
                          {item.calories} ккал
                        </span>
                      </div>
                      <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <span>Вес: {item.weight}г</span>
                        <span>Б: {item.proteins}г</span>
                        <span>Ж: {item.fats}г</span>
                        <span>У: {item.carbs}г</span>
                      </div>
                    </div>
                  ))}

                  {/* Мини-итог только для этого приема пищи */}
                  <div className="mt-6 pt-4 border-t-2 border-slate-50">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                      <span>Итого за этот прием:</span>
                      <span className="text-slate-800">
                        {filteredItems.reduce((sum, i) => sum + i.calories, 0)}{" "}
                        ккал
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};
