import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  addNewProduct,
  initialFormState,
  setNutritional,
} from "../../store/mealsSlice";
import type { mealEntry } from "../../types";
import { foodDatabase } from "../../data";

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

export const Form = () => {
  const { nutritional } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);

  // Новый стейт для чекбокса "Авто-КБЖУ"
  const [isAutoKBJU, setIsAutoKBJU] = useState<boolean>(false);

  const selectedDate = new Date();

  // Эффект автоподставления КБЖУ при вводе названия
  useEffect(() => {
    if (!isAutoKBJU) return;

    // Ищем точное совпадение по названию
    const foundProduct = foodDatabase.find(
      (p) =>
        p.name.toLowerCase().trim() ===
        nutritional.productName.toLowerCase().trim()
    );

    if (foundProduct) {
      dispatch(
        setNutritional({
          ...nutritional,
          proteins: foundProduct.proteins,
          fats: foundProduct.fats,
          carbs: foundProduct.carbs,
          calories: foundProduct.calories,
        })
      );
    } else {
      // Если продукт стерт или не найден — обнуляем КБЖУ
      dispatch(
        setNutritional({
          ...nutritional,
          proteins: 0,
          fats: 0,
          carbs: 0,
          calories: 0,
        })
      );
    }
  }, [nutritional.productName, isAutoKBJU, dispatch]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const dateStr = format(selectedDate, "dd.MM.yy");
    if (nutritional.productName === "" || nutritional.weight <= 0) {
      setError(true);
    } else {
      setError(false);

      dispatch(
        addNewProduct({
          date: dateStr,
          meal: nutritional.meal,
          nutritional: nutritional,
        })
      );

      const meal = nutritional.meal;
      dispatch(setNutritional({ ...initialFormState, meal: meal }));
      setIsAutoKBJU(false); // сбрасываем чекбокс для следующего ввода
    }
  };

  const updateNutritional = (key: string, value: string | number) => {
    dispatch(setNutritional({ ...nutritional, [key]: value }));
  };

  // Проверяем, включен ли автомат и нет ли такого продукта в базе
  const isProductNotFound =
    isAutoKBJU &&
    nutritional.productName.trim() !== "" &&
    !foodDatabase.some(
      (p) =>
        p.name.toLowerCase() === nutritional.productName.toLowerCase().trim()
    );

  return (
    <div className="">
      <div className="px-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Синий заголовок */}
          <div className="p-4 bg-indigo-600 text-white">
            <p className="text-indigo-100 text-xs mt-0.5">
              Введите данные или найдите автоматически
            </p>
          </div>

          <form onSubmit={handleAddProduct} className="p-6 space-y-5">
            {/* Название продукта с datalist */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                Название продукта
              </label>
              <input
                value={nutritional.productName || ""}
                onChange={(e) =>
                  updateNutritional("productName", e.target.value)
                }
                placeholder="Например: Банан"
                list="pwa-food-suggestions" // Связываем с базой данных продуктов
                className={
                  error && nutritional.productName === ""
                    ? "w-full bg-slate-50 border border-red-500 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                    : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                }
              />
              {/* Локальный список автоподсказок */}
              <datalist id="pwa-food-suggestions">
                {foodDatabase.map((p, idx) => (
                  <option key={idx} value={p.name} />
                ))}
              </datalist>
            </div>

            {/* Современный переключатель (Чекбокс Авто-КБЖУ) */}
            <label className="flex items-center gap-3 cursor-pointer py-2 px-3 bg-slate-50 rounded-2xl border border-slate-100 select-none hover:bg-slate-100/70 transition-all">
              <input
                type="checkbox"
                className="w-5 h-5 accent-indigo-600 rounded-lg cursor-pointer"
                checked={isAutoKBJU}
                onChange={(e) => setIsAutoKBJU(e.target.checked)}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">
                  Автоматический режим
                </span>
                <span className="text-[11px] text-slate-500">
                  Заполнить КБЖУ из встроенного справочника
                </span>
              </div>
            </label>

            {/* Масса */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                Масса (г)
              </label>
              <input
                step="any"
                value={nutritional.weight || ""}
                onChange={(e) => updateNutritional("weight", e.target.value)}
                min={0}
                type="number"
                placeholder="100"
                className={
                  error && nutritional.weight <= 0
                    ? "w-full bg-slate-50 border border-red-500 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                    : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                }
              />
            </div>

            {/* Макронутриенты */}
            <div className="grid grid-cols-3 gap-3">
              {macronutrients.map((mn) => (
                <div key={mn.id}>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 ml-1 truncate">
                    {mn.name} / 100г
                  </label>
                  <input
                    value={nutritional[mn.nameEN as keyof mealEntry] || ""}
                    onChange={(e) =>
                      updateNutritional(mn.nameEN, e.target.value)
                    }
                    step="any"
                    type="number"
                    min={0}
                    placeholder="0"
                    disabled={isAutoKBJU} // Блокируем ввод при Авто-КБЖУ
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 font-medium transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Калорийность */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                Калорийность за 100 гр
              </label>
              <div className="relative">
                <input
                  value={nutritional.calories === 0 ? "" : nutritional.calories}
                  onChange={(e) =>
                    updateNutritional("calories", e.target.value)
                  }
                  step="any"
                  min={0}
                  type="number"
                  placeholder="0"
                  disabled={isAutoKBJU} // Блокируем ввод при Авто-КБЖУ
                  className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 text-2xl font-bold text-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 font-medium">
                  kcal
                </span>
              </div>
            </div>

            {/* Красивое предупреждение, если продукт не найден в режиме авто */}
            {isProductNotFound && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 leading-relaxed">
                ⚠️ Продукт <strong>"{nutritional.productName}"</strong> не
                найден в офлайн-базе. Вы можете отключить авто-режим и ввести
                КБЖУ вручную.
              </div>
            )}

            {/* Кнопка отправки */}
            <button
              type="submit"
              className={
                error
                  ? "w-full bg-slate-900 border-2 border-red-500 text-red-500 py-3 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  : "w-full bg-slate-900 text-white py-3 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 cursor-pointer"
              }
            >
              Добавить в дневник
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
