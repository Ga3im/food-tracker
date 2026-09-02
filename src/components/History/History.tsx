import { format } from "date-fns";
import { Calendar } from "../Calendar/Calendar";
import { useMemo, Fragment } from "react";
import { ru } from "date-fns/locale";
import { useAppSelector } from "../../store";

export const History = () => {
  const { product, selectedDate } = useAppSelector((state) => state.meal);

  const mealOrder = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3,
  } as const;

  const dateKey = format(selectedDate, "dd.MM.yy");

  const dayData = useMemo(() => {
    return product.find((p) => p.date === dateKey);
  }, [product, dateKey]);

  const totals = useMemo(() => {
    if (!dayData?.items) {
      return { calories: 0, proteins: 0, fats: 0, carbs: 0 };
    }
    return dayData.items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        proteins: acc.proteins + item.proteins,
        fats: acc.fats + item.fats,
        carbs: acc.carbs + item.carbs,
      }),
      { calories: 0, proteins: 0, fats: 0, carbs: 0 }
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
                    <th className="py-3 px-3 border-r border-slate-200">
                      Название
                    </th>
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
                        <tr className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                          {/* max-w-0 и truncate здесь критически важны: они заставляют длинный текст сворачиваться в три точки, не раздвигая колонку */}
                          <td className="py-3 px-2 font-semibold text-slate-800 text-sm border-r border-slate-200 break-words">
                            {item.productName}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200 font-medium">
                            {item.weight}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200">
                            {item.proteins.toFixed(1)}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200">
                            {item.fats.toFixed(1)}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600 text-sm border-r border-slate-200">
                            {item.carbs.toFixed(1)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 text-sm">
                            {item.calories.toFixed(0)}
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
                  Ккал{" "}
                </span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                {" "}
                Белки{" "}
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
                {" "}
                Жиры{" "}
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
                {" "}
                Углеводы{" "}
              </p>
              <p className="text-lg font-bold">
                {totals.carbs.toFixed(0)}{" "}
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
