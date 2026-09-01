import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "../../store";
import { setEdittingProduct, setIsEdit } from "../../store/mealsSlice";
import type { mealEntry } from "../../types";

export const MealList = () => {
  const { product, nutritional } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();
  const selectedDate = new Date();
  const dateKey = format(selectedDate, "dd.MM.yy");

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: mealEntry;
  } | null>(null);

  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMenuOpening = useRef<boolean>(false);

  const dayData = product.find((p) => p.date === dateKey);

  useEffect(() => {
    const handleClose = () => {
      if (!isMenuOpening.current) {
        setContextMenu(null);
      }
    };

    window.addEventListener("mousedown", handleClose);
    window.addEventListener("touchstart", handleClose);
    
    return () => {
      window.removeEventListener("mousedown", handleClose);
      window.removeEventListener("touchstart", handleClose);
    };
  }, []);

  const filteredItems = useMemo(() => {
    return (
      dayData?.items.filter((item) => item.meal === nutritional.meal) || []
    );
  }, [dayData, nutritional.meal]);

  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.proteins += item.proteins || 0;
        acc.fats += item.fats || 0;
        acc.carbs += item.carbs || 0;
        acc.weight += item.weight || 0;
        return acc;
      },
      { calories: 0, proteins: 0, fats: 0, carbs: 0, weight: 0 }
    );
  }, [filteredItems]);

  const handleEdit = (item: mealEntry) => {
    console.log("Лог: Нажали редактировать", item);
    dispatch(setEdittingProduct(item));
    dispatch(setIsEdit(true));
    setContextMenu(null);
  };

  const handleDelete = (item: mealEntry) => {
    console.log("Лог: Нажали удалить", item);
    setContextMenu(null);
  };

  const handleCopy = (item: mealEntry) => {
    console.log("Лог: Нажали копировать", item);
    setContextMenu(null);
  };

  // Расчет координат меню с защитой от выхода за края экрана
  const openMenuAtCoordinates = (
    clientX: number,
    clientY: number,
    item: mealEntry
  ) => {
    const menuWidth = 170;
    const menuHeight = 140;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const x = clientX + menuWidth > screenWidth ? screenWidth - menuWidth - 15 : clientX;
    const y = clientY + menuHeight > screenHeight ? clientY - menuHeight - 5 : clientY;

    setContextMenu({ x, y, item });
  };

  // Обработчик правого клика (Десктоп)
  const handleContextMenu = (e: React.MouseEvent, item: mealEntry) => {
    e.preventDefault(); // Полностью блокируем системное меню браузера здесь
    e.stopPropagation(); // Не даем событию всплывать к window

    console.log("Лог: Сработал правый клик по карточке");

    isMenuOpening.current = true;
    openMenuAtCoordinates(e.clientX, e.clientY, item);

    setTimeout(() => {
      isMenuOpening.current = false;
    }, 80);
  };

  // Обработчик удержания (Мобильные)
  const handleTouchStart = (e: React.TouchEvent, item: mealEntry) => {
    if (e.touches.length > 1) return;

    const touch = e.touches[0];
    const travelX = touch.clientX;
    const travelY = touch.clientY;

    if (touchTimer.current) clearTimeout(touchTimer.current);

    touchTimer.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(40);

      isMenuOpening.current = true;
      openMenuAtCoordinates(travelX, travelY, item);

      setTimeout(() => {
        isMenuOpening.current = false;
      }, 100);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  return (
    <div className="w-full relative">
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-xl">
            🥗
          </div>
          <p className="text-sm">В этой категории пока пусто</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onContextMenu={(e) => handleContextMenu(e, item)}
              onTouchStart={(e) => handleTouchStart(e, item)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={() => {
                if (touchTimer.current) {
                  clearTimeout(touchTimer.current);
                  touchTimer.current = null;
                }
              }}
              className="bg-white px-3 py-2.5 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center active:scale-[0.99] transition-transform select-none cursor-pointer"
            >
              <div className="flex flex-col flex-1 pr-2">
                <span className="font-bold text-slate-800 text-start text-sm sm:text-base">
                  {item.productName}
                </span>
                <span className="text-[11px] text-slate-400 font-medium text-start mt-0.5">
                  {item.weight.toFixed(1)}г • Б: {item.proteins.toFixed(1)} Ж:{" "}
                  {item.fats.toFixed(1)} У: {item.carbs.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 leading-none">
                    {item.calories.toFixed(0)}
                  </span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    ккал
                  </p>
                </div>
              </div>
            </div>
          ))}

          {dayData && dayData.items.length > 1 && (
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div className="flex flex-col flex-1 pr-2">
                <span className="font-bold text-slate-700 text-start text-sm">
                  Всего в категории
                </span>
                <span className="text-[11px] text-slate-500 font-semibold text-start mt-0.5">
                  {totals.weight.toFixed(1)}г • Б: {totals.proteins.toFixed(1)}{" "}
                  Ж: {totals.fats.toFixed(1)} У: {totals.carbs.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-base font-black text-indigo-600 leading-none">
                    {totals.calories.toFixed(0)}
                  </span>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    ккал
                  </p>
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
          // pointer-events-auto и z-[9999] гарантируют, что клики будут нажиматься и обрабатываться железно
          className="z-[9999] pointer-events-auto min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 flex flex-col font-sans select-none"
          onMouseDown={(e) => e.stopPropagation()} // Защита от закрытия при клике на само меню
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
