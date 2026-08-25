import { useMemo, type Dispatch, type SetStateAction } from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../store";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { setEdittingProduct, setIsEdit } from "../../store/mealsSlice";

type mealListProp = {
  setActiveTab: Dispatch<SetStateAction<"form" | "list" | "both">>;
};

export const MealList = ({ setActiveTab }: mealListProp) => {
  const { product, nutritional } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();
  const selectedDate = new Date();
  const dateKey = format(selectedDate, "dd.MM.yy");

  const dayData = product.find((p) => p.date === dateKey);

  const filteredItems = useMemo(() => {
    return (
      dayData?.items.filter((item) => item.meal === nutritional.meal) || []
    );
  }, [dayData, nutritional.meal]);

  // Выносим расчет итогов, чтобы не пересчитывать при каждом рендере
  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.proteins += item.proteins || 0;
        acc.fats += item.fats || 0;
        acc.carbs += item.carbs || 0;
        return acc;
      },
      { calories: 0, proteins: 0, fats: 0, carbs: 0 }
    );
  }, [filteredItems]);

  const handleEdit = (item) => {
    console.log(item);
    if (!isDesktop) {
      setActiveTab("form");
    }
    dispatch(setEdittingProduct(item));
    dispatch(setIsEdit(true));
  };

  const { isDesktop } = useIsDesktop();

  return (
    <div className="">
      <div className="px-4">
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
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center active:scale-[0.98] transition-transform"
                >
                  {/* Левая часть: название и БЖУ */}
                  <div className="flex flex-col flex-1 pr-2">
                    <span className="font-bold text-slate-800 text-start">
                      {item.productName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium text-start">
                      {item.weight}г • Б: {item.proteins.toFixed(1)} Ж:{" "}
                      {item.fats.toFixed(1)} У: {item.carbs.toFixed(1)}
                    </span>
                  </div>

                  {/* Правая часть: Блок калорий + Кнопка редактирования */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 leading-none">
                        {item.calories.toFixed(0)}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        ккал
                      </p>
                    </div>

                    {/* Кнопка карандаша */}
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* Аккуратный блок мини-итога с БЖУ */}
              {dayData && dayData.items.length > 0 && (
                <div className="my-8 bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                        Всего за{" "}
                        {nutritional.meal === "breakfast"
                          ? "завтрак"
                          : nutritional.meal === "lunch"
                          ? "обед"
                          : nutritional.meal === "dinner"
                          ? "ужин"
                          : "перекус"}
                      </p>
                      <h3 className="text-3xl font-black">
                        {totals.calories.toFixed(0)}{" "}
                        {dayData.dailyLimit && dayData.dailyLimit.cals > 0
                          ? `/ ${dayData.dailyLimit.cals}`
                          : null}
                        <span className="text-lg font-normal text-slate-400">
                          {" "}
                          Ккал
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Белки
                      </p>
                      <p className="text-lg font-bold">
                        {totals.proteins.toFixed(0)}
                        {dayData.dailyLimit && dayData.dailyLimit.protein > 0
                          ? `/ ${dayData.dailyLimit.protein}`
                          : null}{" "}
                        <span className="text-xs ml-0.5 text-slate-500">г</span>
                      </p>
                    </div>
                    <div className="text-center border-x border-slate-800">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Жиры
                      </p>
                      <p className="text-lg font-bold">
                        {totals.fats.toFixed(0)}{" "}
                        {dayData.dailyLimit && dayData.dailyLimit.fat > 0
                          ? `/ ${dayData.dailyLimit.fat}`
                          : null}
                        <span className="text-xs ml-0.5 text-slate-500">г</span>
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                        Углеводы
                      </p>
                      <p className="text-lg font-bold">
                        {totals.carbs.toFixed(0)}
                        {dayData.dailyLimit && dayData.dailyLimit.carb > 0
                          ? `/ ${dayData.dailyLimit.carb}`
                          : null}
                        <span className="text-xs ml-0.5 text-slate-500">г</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
