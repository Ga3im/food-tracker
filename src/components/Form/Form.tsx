import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";
import {
  addNewProduct,
  initialFormState,
  setNutritional,
} from "../../store/mealsSlice";
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

export const Form = () => {
  const { nutritional } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<boolean>(false);

  const selectedDate = new Date(); // Или бери из стора, если нужно за другой день

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

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

  const updateNutritional = (key: string, value: string | number) => {
    dispatch(setNutritional({ ...nutritional, [key]: value }));
  };

  return (
    <div className="">
      <div className="px-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Тот самый синий заголовок */}
          <div className="p-2 bg-indigo-600">
            <p className="text-[30px] p-2">Добавить продукт</p>
            <p className="text-indigo-100 text-sm">Введите данные продукта</p>
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
                    ? "w-full bg-slate-50 border border-[red] rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                    : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
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
                    ? "w-full bg-slate-50 border border-[red] rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
                    : "w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 outline-none focus:border-indigo-500 transition-all text-lg font-medium"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
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
                  className="w-full bg-indigo-50/50 border border-indigo-100 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 text-2xl font-bold text-indigo-600"
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
                  ? "w-full bg-slate-900 border-2 border-[red] text-[red] py-2 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  : "w-full bg-slate-900 text-white py-2 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              }
            >
              Добавить
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
