import { format } from "date-fns";
import { Calendar } from "../Calendar/Calendar";
import { useState } from "react";
import { ru } from "date-fns/locale";
import { useAppSelector } from "../../store";

export const History = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { product } = useAppSelector((state) => state.meal);

  const mealOrder = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3,
  } as const;

  const dateKey = format(selectedDate, "dd.MM.yy");
  const dayData = product.find((p) => p.date === dateKey);

  const totals = dayData?.items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      proteins: acc.proteins + item.proteins,
      fats: acc.fats + item.fats,
      carbs: acc.carbs + item.carbs,
    }),
    { calories: 0, proteins: 0, fats: 0, carbs: 0 }
  ) || { calories: 0, proteins: 0, fats: 0, carbs: 0 };

  const displayItems = dayData?.items
    ? [...dayData.items].sort((a, b) => {
        const getOrder = (meal: string | null) => {
          if (meal && meal in mealOrder) {
            return mealOrder[meal as keyof typeof mealOrder];
          }
          return 999;
        };

        return getOrder(a.meal) - getOrder(b.meal);
      })
    : [];

  return (
    <div className="px-2">
      <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <div className="text-start pt-[20px]">
        <h2 className="text-xl font-bold text-slate-800">
          История за {format(selectedDate, "d MMMM", { locale: ru })}
        </h2>

        {!dayData || dayData.items.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 text-center">
            <p className="text-slate-400">Нет записей за этот день 🥗</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayItems?.map((item, index, array) => {
              const prev = array[index - 1];
              const showHeader = !prev || prev.meal !== item.meal;

              return (
                <div key={item.id} className="space-y-2">
                  {showHeader && (
                    <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500 ml-1">
                      {item.meal === "breakfast" && "Завтрак"}
                      {item.meal === "lunch" && "Обед"}
                      {item.meal === "dinner" && "Ужин"}
                      {item.meal === "snack" && "Перекус"}
                    </h3>
                  )}

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center active:scale-[0.98] transition-transform">
                    {/* Левая часть: название и БЖУ (добавлен flex-1 для правильного распределения места) */}
                    <div className="flex flex-col flex-1 pr-2">
                      <span className="font-bold text-slate-800">
                        {item.productName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.weight}г • Б: {item.proteins.toFixed(1)} Ж:{" "}
                        {item.fats.toFixed(1)} У: {item.carbs.toFixed(1)}
                      </span>
                    </div>

                    {/* Правая часть */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 leading-none">
                          {item.calories.toFixed(0)}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          ккал
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {dayData && dayData.items.length > 0 && (
        <div className="my-8 bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                Всего за день
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
  );
};
