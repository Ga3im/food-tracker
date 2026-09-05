import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../store";
import {
  addProduct,
  updateProduct,
  initialFormState,
  setIsEdit,
  setNutritional,
  setIsDirectInput,
  pasteProduct,
  cancelEdit,
} from "../store/mealsSlice";
import { foodDatabase } from "../data";
import type { MealEntry } from "../types";

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
  const { nutritional, edittingProduct, isEdit, isDirectInput, copiedProduct } =
    useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);
  const [isAutoKBJU, setIsAutoKBJU] = useState<boolean>(false);
  const [, ] = useState<MealEntry>();

  const selectedDate = new Date();

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
          addProduct({
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

  const updateNutritional = (
    key: keyof typeof nutritional | string,
    value: string | number
  ) => {
    const newValue = key === "productName" ? value : Number(value);
    dispatch(setNutritional({ ...nutritional, [key]: newValue }));
  };

  const handlePaste = () => {
    dispatch(pasteProduct(nutritional.meal));
  };

  const handleCancelEdit = () => {
    const meal = nutritional.meal;
    dispatch(cancelEdit(meal));
    setError(false);
  };

  return (
    <div className="w-full">
      <div className="px-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-start">
          <div className="p-3.5 bg-indigo-600 text-white flex justify-between items-center">
            <h2 className="text-sm font-bold tracking-wide uppercase">
              {isEdit ? "Редактирование" : "Добавление продукта"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Название продукта
              </label>
              <div className="relative w-full group">
                <input
                  value={String(nutritional.productName || "")}
                  onChange={(e) =>
                    updateNutritional("productName", e.target.value)
                  }
                  placeholder="Например: Банан"
                  list="pwa-food-suggestions"
                  className={`w-full bg-slate-50 border rounded-xl pl-3 pr-16 py-2 outline-none focus:border-indigo-500 transition-all text-sm font-medium ${
                    error && nutritional.productName === ""
                      ? "border-red-500"
                      : "border-slate-200"
                  }`}
                />

                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => setIsAutoKBJU(!isAutoKBJU)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${
                      isAutoKBJU
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    Авто
                  </button>
                )}
              </div>
              <datalist id="pwa-food-suggestions">
                {foodDatabase.map((p, idx) => (
                  <option key={idx} value={p.name} />
                ))}
              </datalist>
            </div>

            {/* Чекбокс режима ввода без учета на 100г */}
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-100 select-none hover:bg-slate-100/70 transition-all text-xs">
              <input
                type="checkbox"
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                checked={isDirectInput}
                onChange={() => dispatch(setIsDirectInput(!isDirectInput))}
              />
              <span className="font-bold text-slate-700 truncate">
                Ввод без учета на 100гр
              </span>
            </label>

            {/* Масса */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Масса (г)
              </label>
              <input
                step="any"
                value={nutritional.weight || ""}
                onChange={(e) => updateNutritional("weight", e.target.value)}
                min={0}
                type="number"
                placeholder="100"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 outline-none focus:border-indigo-500 transition-all text-sm font-medium ${
                  error && nutritional.weight <= 0
                    ? "border-red-500"
                    : "border-slate-200"
                }`}
              />
            </div>

            {/* Компактный блок КБЖУ в один ряд (4 колонки) */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
                {isDirectInput ? "Итоговые КБЖУ за весь вес" : "КБЖУ за 100 гр"}
              </label>

              <div className="grid grid-cols-4 gap-1.5">
                {macronutrients.map((mn) => (
                  <div key={mn.id} className="flex flex-col">
                    <input
                      value={nutritional[mn.nameEN as keyof MealEntry] || ""}
                      onChange={(e) =>
                        updateNutritional(mn.nameEN, e.target.value)
                      }
                      step="any"
                      type="number"
                      min={0}
                      placeholder={mn.name}
                      disabled={isAutoKBJU}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-center outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold transition-colors"
                    />
                    <span className="text-[9px] text-center text-slate-400 font-bold mt-0.5">
                      {mn.name}
                    </span>
                  </div>
                ))}

                {/* Калории в конце того же ряда */}
                <div className="flex flex-col">
                  <input
                    value={
                      nutritional.calories === undefined ||
                      nutritional.calories === null ||
                      nutritional.calories === 0
                        ? ""
                        : nutritional.calories
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        updateNutritional("calories", "");
                        return;
                      }
                      updateNutritional("calories", Number(val));
                    }}
                    step="any"
                    min={0}
                    type="number"
                    placeholder="Ккал"
                    disabled={isAutoKBJU}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-1 py-1.5 text-center outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold transition-colors"
                  />
                  <span className="text-[9px] text-center text-indigo-600 font-bold mt-0.5">
                    Ккал
                  </span>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            {copiedProduct && (
              <button
                onClick={handlePaste}
                className="w-full bg-[#666666] hover:bg-[#555555] text-white font-bold py-2.5 px-4 rounded-xl shadow-md active:scale-[0.99] transition-all text-sm"
              >
                Вставить
              </button>
            )}
            <div className="pt-1 space-y-2">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md active:scale-[0.99] transition-all text-sm"
              >
                {isEdit ? "Сохранить изменения" : "Добавить в дневник"}
              </button>

              {isEdit && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 px-4 rounded-xl transition-all text-xs"
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
