import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  addNewProduct,
  updateProduct, // Импортируем метод обновления
  initialFormState,
  setIsEdit,
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
  const { nutritional, edittingProduct, isEdit } = useAppSelector(
    (state) => state.meal
  );
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);
  const [isAutoKBJU, setIsAutoKBJU] = useState<boolean>(false);

  const selectedDate = new Date();

  // Автоподставление КБЖУ при вводе названия (только если не в режиме редактирования)
  useEffect(() => {
    if (!isAutoKBJU || isEdit) return;

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
  }, [nutritional.productName, isAutoKBJU, isEdit, dispatch]);

  useEffect(() => {
    if (isEdit && edittingProduct) {
      const factor = 100 / (edittingProduct.weight || 1);

      dispatch(
        setNutritional({
          ...edittingProduct,
          // Разворачиваем итоговые БЖУ обратно в формат "на 100 грамм" для инпутов
          proteins: Number((edittingProduct.proteins * factor).toFixed(1)),
          fats: Number((edittingProduct.fats * factor).toFixed(1)),
          carbs: Number((edittingProduct.carbs * factor).toFixed(1)),
          calories: Math.round(edittingProduct.calories * factor),
        })
      );
    }
  }, [isEdit, edittingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateStr = format(selectedDate, "dd.MM.yy");
    if (nutritional.productName === "" || nutritional.weight <= 0) {
      setError(true);
    } else {
      setError(false);

      if (isEdit) {
        // СОХРАНЯЕМ ИЗМЕНЕНИЯ ПРИ РЕДАКТИРОВАНИИ
        dispatch(
          updateProduct({
            date: dateStr,
            meal: nutritional.meal,
            nutritional: nutritional,
          })
        );
        dispatch(setIsEdit(false));
      } else {
        // ДОБАВЛЯЕМ НОВЫЙ ПРОДУКТ
        dispatch(
          addNewProduct({
            date: dateStr,
            meal: nutritional.meal,
            nutritional: nutritional,
          })
        );
      }

      const meal = nutritional.meal;
      dispatch(setNutritional({ ...initialFormState, meal: meal }));
      setIsAutoKBJU(false);
    }
  };

  const updateNutritional = (key: string, value: string | number) => {
    dispatch(setNutritional({ ...nutritional, [key]: value }));
  };

  const handleCancelEdit = () => {
    const meal = nutritional.meal;
    dispatch(setNutritional({ ...initialFormState, meal: meal }));
    dispatch(setIsEdit(false));
    setError(false);
  };

  return (
    <div className="">
      <div className="px-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-start">
          {/* Динамический синий заголовок */}
          <div className="p-4 bg-indigo-600 text-white">
            <h2 className="text-lg font-bold">
              {isEdit ? "Редактирование продукта" : "Добавление продукта"}
            </h2>
            <p className="text-indigo-100 text-xs mt-0.5">
              {isEdit
                ? "Измените вес или макронутриенты"
                : "Введите данные или найдите автоматически"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Название продукта */}
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
                list="pwa-food-suggestions"
                className={
                  error && nutritional.productName === ""
                    ? "w-full bg-slate-50 border border-red-500 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                    : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                }
              />
              <datalist id="pwa-food-suggestions">
                {foodDatabase.map((p, idx) => (
                  <option key={idx} value={p.name} />
                ))}
              </datalist>
            </div>

            {/* Автоматический режим (скрываем при редактировании) */}
            {!isEdit && (
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
            )}

            {/* Масса */}
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
                      updateNutritional(mn.nameEN, Number(e.target.value))
                    }
                    step="any"
                    type="number"
                    min={0}
                    placeholder="0"
                    disabled={isAutoKBJU}
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
              <input
                value={nutritional.calories === 0 ? "" : nutritional.calories}
                onChange={(e) =>
                  updateNutritional("calories", Number(e.target.value))
                }
                step="any"
                min={0}
                type="number"
                placeholder="0"
                disabled={isAutoKBJU}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 font-medium transition-colors"
              />
            </div>

            {/* Кнопки действий */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-100 active:scale-[0.99] transition-all text-base"
              >
                {isEdit ? "Сохранить изменения" : "Добавить в дневник"}
              </button>

              {isEdit && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-2xl transition-all text-sm"
                >
                  Отменить редактирование
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
