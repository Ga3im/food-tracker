import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../store";
import {
  addProduct,
  setIsDirectInput,
  pasteProduct,
  cancelEdit,
  initialFormState,
  updateProduct,
} from "../store/mealsSlice";
import { foodDatabase } from "../data";
import type { MealEntry, MealType } from "../types";
import { useParams } from "react-router-dom";

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
  const [currentProduct, setCurrentProduct] = useState<MealEntry>(initialFormState);
  const [isError, setIsError] = useState<boolean>(false);
  const [isAutoKBJU, setIsAutoKBJU] = useState<boolean>(false);

  const { product, editedProduct, isDirectInput, copiedProduct } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();
  const { mealId } = useParams();

  const selectedDate = new Date();

  useEffect(() => {
    if (editedProduct) {
      setCurrentProduct({ ...editedProduct, meal: mealId as MealType });
    } else {
      setCurrentProduct({ ...product, id: crypto.randomUUID(), meal: mealId as MealType });
    }
  }, [editedProduct]);

  useEffect(() => {
    if (!isAutoKBJU) return;
    const foundProduct = foodDatabase.find(
      (p) => p.name.toLowerCase().trim() === currentProduct.productName.toLowerCase().trim()
    );

    if (foundProduct) {
      setCurrentProduct({
        ...currentProduct,
        proteins: foundProduct.proteins,
        fats: foundProduct.fats,
        carbs: foundProduct.carbs,
        calories: foundProduct.calories,
      });
    }
    console.log(currentProduct);
  }, [currentProduct.productName, isAutoKBJU]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = format(selectedDate, "dd.MM.yy");
    setIsError(false);

    if (editedProduct) {
      dispatch(
        updateProduct({
          date: dateStr,
          updatedProduct: currentProduct,
        })
      );
    } else {
      dispatch(
        addProduct({
          date: dateStr,
          product: currentProduct,
        })
      );
    }

    setIsAutoKBJU(false);
    setCurrentProduct(initialFormState);
  };

  const handleProductChange = (key: string, value: string) => {
    // 1. Для названия продукта просто сохраняем текст как есть
    if (key === "productName") {
      setCurrentProduct({ ...currentProduct, [key]: value });
      return;
    }

    // 2. Для числовых полей стандартизируем разделитель (заменяем запятую на точку на лету)
    const normalizedValue = value.replace(",", ".");

    // 3. Если пользователь всё стёр, сохраняем пустую строку '',
    // благодаря этому инпут станет пустым и не будет подставлять "0"
    if (normalizedValue === "") {
      setCurrentProduct({ ...currentProduct, [key]: "" });
      return;
    }
    // 4. Проверяем валидность ввода регулярным выражением (разрешает числа и промежуточный ввод вроде "0.")
    if (/^\d*\.?\d*$/.test(normalizedValue)) {
      // Сохраняем как СТРОКУ, чтобы точка или ноль впереди (например, "0.5") не стирались браузером
      setCurrentProduct({ ...currentProduct, [key]: normalizedValue });
    }
  };

  const handlePaste = () => {
    dispatch(pasteProduct(product.meal));
    setIsAutoKBJU(false);
  };

  const handleCancelEdit = () => {
    dispatch(cancelEdit());
    setIsError(false);
  };

  const isFormInvalid =
    !currentProduct.productName ||
    !currentProduct.weight ||
    !currentProduct.calories ||
    !currentProduct.proteins ||
    !currentProduct.fats ||
    !currentProduct.carbs;

  return (
    <div className="w-full">
      <div className="px-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-start">
          <div className="p-3.5 bg-indigo-600 text-white flex justify-between items-center">
            <h2 className="text-sm font-bold tracking-wide uppercase">
              {editedProduct ? "Редактирование" : "Добавление продукта"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Название продукта</label>
              <div className="relative w-full group">
                <input
                  value={currentProduct.productName}
                  onChange={(e) => handleProductChange("productName", e.target.value)}
                  placeholder="Например: Банан"
                  list="pwa-food-suggestions"
                  className={`w-full bg-slate-50 border rounded-xl pl-3 pr-16 py-2 outline-none focus:border-indigo-500 transition-all text-sm font-medium ${
                    isError && currentProduct.productName === "" ? "border-red-500" : "border-slate-200"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setIsAutoKBJU(!isAutoKBJU)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${
                    isAutoKBJU ? "bg-indigo-600 text-white shadow-sm" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  }`}
                >
                  Авто
                </button>
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
              <span className="font-bold text-slate-700 truncate">Ввод без учета на 100гр</span>
            </label>

            {/* Масса */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Масса (г)</label>
              <input
                type="text"
                inputMode="decimal"
                value={currentProduct.weight}
                onChange={(e) => handleProductChange("weight", e.target.value)}
                placeholder="100"
                className={`w-full bg-slate-50 border rounded-xl px-3 py-2 outline-none focus:border-indigo-500 transition-all text-sm font-medium ${
                  isError && Number(currentProduct.weight) <= 0 ? "border-red-500" : "border-slate-200"
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
                      value={currentProduct[mn.nameEN as keyof MealEntry] ?? ""}
                      onChange={(e) => handleProductChange(mn.nameEN, e.target.value)}
                      step="any"
                      type="text"
                      placeholder={mn.name}
                      disabled={isAutoKBJU}
                      className={`w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-center outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold transition-colors  isError && product.calories <= 0
                        ? "border-red-500"
                        : "border-slate-200"
                    }`}
                    />
                    <span className="text-[9px] text-center text-slate-400 font-bold mt-0.5">{mn.name}</span>
                  </div>
                ))}

                {/* Калории в конце того же ряда */}
                <div className="flex flex-col">
                  <input
                    value={currentProduct.calories}
                    onChange={(e) => {
                      handleProductChange("calories", e.target.value);
                    }}
                    step="any"
                    type="text"
                    placeholder="Ккал"
                    disabled={isAutoKBJU}
                    className={`w-full bg-slate-50 border rounded-lg px-1 py-1.5 text-center outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-xs font-bold transition-colors ${
                      isError && Number(currentProduct.calories) <= 0 ? "border-red-500" : "border-slate-200"
                    }`}
                  />
                  <span className="text-[9px] text-center text-indigo-600 font-bold mt-0.5">Ккал</span>
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
                disabled={isFormInvalid}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md active:scale-[0.99] transition-all text-sm disabled:opacity-50"
              >
                {editedProduct ? "Сохранить изменения" : "Добавить в дневник"}
              </button>

              {editedProduct && (
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
