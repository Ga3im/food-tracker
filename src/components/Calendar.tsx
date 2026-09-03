import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ru } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "../store";
import { setSelectedDate } from "../store/mealsSlice";

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { product, selectedDate } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const date = new Date();

  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  const daysWithData = new Set<string>();
  product.forEach((item) => {
    const parts = item.date.split(".");
    if (parts.length !== 3) return;

    const [dayStr, monthStr, yearShort] = parts;

    const currentMonthStr = format(currentMonth, "MM");
    const currentYearStr = format(currentMonth, "yy");

    if (monthStr === currentMonthStr && yearShort === currentYearStr) {
      daysWithData.add(dayStr.padStart(2, "0"));
    }
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-md mx-auto">
      <div className="p-4 flex justify-between items-center bg-indigo-600 text-white">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <h2 className="text-lg font-bold capitalize">
          {format(currentMonth, "LLLL yyyy", { locale: ru })}
        </h2>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-bold text-slate-400 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, firstDayOfMonth);
            const isToday = isSameDay(day, new Date());
            const dayKey = format(day, "dd");
            const hasData = daysWithData.has(dayKey);
            return (
              <button
                key={day.toString()}
                onClick={() => dispatch(setSelectedDate(day))}
                className={`
                  h-12 w-full rounded-xl flex flex-col items-center justify-center relative transition-all
                  ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"}
                  ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md scale-105 z-10"
                      : "hover:bg-slate-50"
                  }
                  ${isToday && !isSelected ? "border border-indigo-200" : ""}
                `}
              >
                <span
                  className={`text-sm font-semibold ${
                    isSelected ? "text-white" : ""
                  }`}
                >
                  {format(day, "d")}
                </span>

                {/* Точка, если есть данные (имитация) */}
                {hasData && isCurrentMonth && (
                  <div
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? "bg-white" : "bg-indigo-400"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Инфо-панель снизу */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-500">
          Выбрано:{" "}
          <b className="text-slate-700">
            {format(selectedDate, "d MMMM", { locale: ru })}
          </b>
        </span>
        <button
          onClick={() => {
            setCurrentMonth(new Date());
            setSelectedDate(new Date());
          }}
          className="text-indigo-600 font-bold"
        >
          Сегодня <span>{formattedDate}</span>
        </button>
      </div>
    </div>
  );
};
