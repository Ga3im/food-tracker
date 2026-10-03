import { format } from "date-fns";
import { Calendar } from "./Calendar";
import { Fragment, useMemo } from "react";
import { ru } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "../store";
import type { Totals } from "./MealList";
import { useContextMenu } from "../hooks/useContextMenu";
import type { MealEntry } from "../types";
import { copyProduct } from "../store/mealsSlice";

export const History = () => {
  const { productsData, selectedDate } = useAppSelector((state) => state.meal);
  const { contextMenu, setContextMenu, handleContextMenu, handleTouchStart, clearTouchTimer } =
    useContextMenu<MealEntry>();
  const dispatch = useAppDispatch();

  const mealOrder = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3,
  } as const;

  const dateKey = format(selectedDate, "dd.MM.yy");

  const dayData = useMemo(() => {
    return productsData?.find((p) => p.date === dateKey);
  }, [productsData, dateKey]);

  const totals = useMemo<Totals>(() => {
    if (!dayData?.items) {
      return { calories: 0, proteins: 0, fats: 0, carbs: 0, weight: 0 };
    }
    return dayData.items.reduce<Totals>(
      (acc, item) => ({
        calories: acc.calories + (Number(item.calories) || 0),
        proteins: acc.proteins + (Number(item.proteins) || 0),
        fats: acc.fats + (Number(item.fats) || 0),
        carbs: acc.carbs + (Number(item.carbs) || 0),
        weight: acc.weight + (Number(item.weight) || 0),
      }),
      { calories: 0, proteins: 0, fats: 0, carbs: 0, weight: 0 }
    );
  }, [dayData]);

  const displayItems = useMemo(() => {
    if (!dayData?.items) return [];

    return [...dayData.items].sort((a, b) => {
      const getOrder = (meal: string | null) => {
        if (meal && meal in mealOrder) {
          return mealOrder[meal as keyof typeof mealOrder];
        }
        return 999;
      };
      return getOrder(a.meal) - getOrder(b.meal);
    });
  }, [dayData]);

  const handleCopy = (item: MealEntry) => {
    dispatch(copyProduct(item));
    setContextMenu(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 font-sans">
      <Calendar />

      <div className="text-start pt-[20px]">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          История за {format(selectedDate, "d MMMM", { locale: ru })}
        </h2>

        {!dayData || dayData.items.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-slate-200 text-center">
            <p className="text-slate-400">Нет записей за этот день</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {/* Обязательно возвращаем w-full, чтобы таблица растягивалась на всю ширину */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600">
                    <th className="py-3 px-3 border-r border-slate-200">Название</th>
                    <th className="py-3 px-2 border-r border-slate-200 text-center">
                      Вес
                      <br />
                      (г)
                    </th>
                    <th className="py-3 px-2 border-r border-slate-200 text-center">
                      Б <br />
                      (г)
                    </th>
                    <th className="py-3 px-2 border-r border-slate-200 text-center">
                      Ж <br />
                      (г)
                    </th>
                    <th className="py-3 px-2 border-r border-slate-200 text-center">
                      У <br />
                      (г)
                    </th>
                    <th className="py-3 px-1 text-center">Ккал</th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item, index, array) => {
                    const prev = array[index - 1];
                    const showHeader = !prev || prev.meal !== item.meal;

                    return (
                      <Fragment key={item.id}>
                        {/* Строка с названием приема пищи */}
                        {showHeader && (
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <td
                              colSpan={6}
                              className="py-2 px-3 text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50/40"
                            >
                              {item.meal === "breakfast" && "Завтрак"}
                              {item.meal === "lunch" && "Обед"}
                              {item.meal === "dinner" && "Ужин"}
                              {item.meal === "snack" && "Перекус"}
                            </td>
                          </tr>
                        )}

                        {/* Строка с данными продукта */}
                        <tr
                          onContextMenu={(e) => handleContextMenu(e, item)}
                          onTouchStart={(e) => handleTouchStart(e, item)}
                          onTouchMove={clearTouchTimer}
                          onTouchEnd={clearTouchTimer}
                          onTouchCancel={clearTouchTimer}
                          className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 transition-colors"
                        >
                          {/* max-w-0 и truncate здесь критически важны: они заставляют длинный текст сворачиваться в три точки, не раздвигая колонку */}
                          <td className="py-3 px-2 font-semibold text-slate-800 text-sm border-r border-slate-200 break-words">
                            {item.productName}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200 font-medium">
                            {item.weight}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200">
                            {Number(item.proteins).toFixed(1)}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200">
                            {Number(item.fats).toFixed(1)}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200">
                            {Number(item.carbs).toFixed(1)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 text-sm">
                            {Number(item.calories).toFixed(0)}
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {dayData && dayData.items.length > 0 && (
        <div className="my-8 bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Всего за день</p>
              <h3 className="text-3xl font-black">
                {totals.calories.toFixed(0)}{" "}
                {dayData.dailyLimit && dayData.dailyLimit.calories > 0 ? `/ ${dayData.dailyLimit.calories}` : null}
                <span className="text-lg font-normal text-slate-400"> Ккал </span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1"> Белки </p>
              <p className="text-lg font-bold">
                {totals.proteins.toFixed(0)}
                {dayData.dailyLimit && dayData.dailyLimit.proteins > 0 ? `/ ${dayData.dailyLimit.proteins}` : null}{" "}
                <span className="text-xs ml-0.5 text-slate-500">г</span>
              </p>
            </div>
            <div className="text-center border-x border-slate-800">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1"> Жиры </p>
              <p className="text-lg font-bold">
                {totals.fats.toFixed(0)}{" "}
                {dayData.dailyLimit && dayData.dailyLimit.fats > 0 ? `/ ${dayData.dailyLimit.fats}` : null}
                <span className="text-xs ml-0.5 text-slate-500">г</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1"> Углеводы </p>
              <p className="text-lg font-bold">
                {totals.carbs.toFixed(0)}{" "}
                {dayData.dailyLimit && dayData.dailyLimit.carbs > 0 ? `/ ${dayData.dailyLimit.carbs}` : null}
                <span className="text-xs ml-0.5 text-slate-500">г</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Отрендеренное кастомное меню */}
      {contextMenu && (
        <div
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            position: "fixed",
          }}
          className="z-[9999] pointer-events-auto min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 flex flex-col font-sans select-none"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            onClick={() => handleCopy(contextMenu.item)}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            📋 Копировать
          </button>
        </div>
      )}
    </div>
  );
};
