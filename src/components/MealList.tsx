import { useMemo } from "react";
import { format } from "date-fns";
import { deleteProductOffline, useAppDispatch, useAppSelector } from "../store";
import { copyProduct, editProduct } from "../store/mealsSlice";
import type { MealEntry } from "../types";
import { useParams } from "react-router-dom";
import { useContextMenu } from "../hooks/useContextMenu";

export type Totals = {
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  weight: number;
};

export const MealList = () => {
  const { productsData, selectedDate } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();
  const { mealId } = useParams();

  const dateKey = format(selectedDate, "dd.MM.yy");
  const dayData = productsData?.find((p) => p.date === dateKey);

  const { contextMenu, setContextMenu, handleContextMenu, handleTouchStart, clearTouchTimer } =
    useContextMenu<MealEntry>();

  const filteredItems = useMemo(() => {
    return dayData?.items.filter((item) => item.meal === mealId) || [];
  }, [dayData, mealId]);

  const totals = useMemo<Totals>(() => {
    return filteredItems.reduce<Totals>(
      (acc, item) => {
        acc.calories += Number(item.calories) || 0;
        acc.proteins += Number(item.proteins) || 0;
        acc.fats += Number(item.fats) || 0;
        acc.carbs += Number(item.carbs) || 0;
        acc.weight += Number(item.weight) || 0;

        return acc;
      },
      { calories: 0, proteins: 0, fats: 0, carbs: 0, weight: 0 }
    );
  }, [filteredItems]);

  const handleEdit = (item: MealEntry) => {
    dispatch(editProduct(item));
    setContextMenu(null);
  };

  const handleDelete = (item: MealEntry) => {
    dispatch(deleteProductOffline({ selectedDate, item }));
    setContextMenu(null);
  };

  const handleCopy = (item: MealEntry) => {
    dispatch(copyProduct(item));
    setContextMenu(null);
  };

  return (
    <div className="w-full relative">
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-xl">🥗</div>
          <p className="text-sm">В этой категории пока пусто</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onContextMenu={(e) => handleContextMenu(e, item)}
              onTouchStart={(e) => handleTouchStart(e, item)}
              onTouchMove={clearTouchTimer}
              onTouchEnd={clearTouchTimer}
              onTouchCancel={clearTouchTimer}
              className="bg-white px-3 py-2.5 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center active:scale-[0.99] transition-transform select-none cursor-pointer"
            >
              <div className="flex flex-col flex-1 pr-2">
                <span className="font-bold text-slate-800 text-start text-sm sm:text-base">{item.productName}</span>
                <span className="text-[11px] text-slate-400 font-medium text-start mt-0.5">
                  {Number(item.weight).toFixed(1)}г • Б: {Number(item.proteins).toFixed(1)} Ж:{" "}
                  {Number(item.fats).toFixed(1)} У: {Number(item.carbs).toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 leading-none">
                    {Number(item.calories).toFixed(0)}
                  </span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ккал</p>
                </div>
              </div>
            </div>
          ))}

          {dayData && dayData.items.length > 1 && (
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div className="flex flex-col flex-1 pr-2">
                <span className="font-bold text-slate-700 text-start text-sm">Всего в категории</span>
                <span className="text-[11px] text-slate-500 font-semibold text-start mt-0.5">
                  {totals.weight.toFixed(1)}г • Б: {totals.proteins.toFixed(1)} Ж: {totals.fats.toFixed(1)} У:{" "}
                  {totals.carbs.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-base font-black text-indigo-600 leading-none">
                    {totals.calories.toFixed(0)}
                  </span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ккал</p>
                </div>
              </div>
            </div>
          )}
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
            onClick={() => handleEdit(contextMenu.item)}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            ✏️ Редактировать
          </button>
          <button
            onClick={() => handleCopy(contextMenu.item)}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            📋 Копировать
          </button>
          <div className="h-[1px] bg-slate-100 my-1" />
          <button
            onClick={() => handleDelete(contextMenu.item)}
            className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            🗑️ Удалить
          </button>
        </div>
      )}
    </div>
  );
};
