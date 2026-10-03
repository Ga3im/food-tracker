import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import type { MealType } from "../types";
import { format, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { setSelectedDate } from "../store/mealsSlice";

export const Options = () => {
  const { selectedDate } = useAppSelector((state) => state.meal);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const meals: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  const isTodaySelected = isSameDay(new Date(selectedDate), new Date());
  const todayISO = new Date().toISOString();

  const handleGoToToday = () => {
    dispatch(setSelectedDate(todayISO));
  };

  const handleMealClick = (meal: MealType) => {
    navigate(`/meal/${meal}`);
  };

  const isCurrentDay = format(selectedDate, "dd.MM.yy") === format(new Date(), "dd.MM.yy");

  return (
    <div className="px-2">
      <div className="grid gap-3 pb-[20px]">
        <h2 className="px-2">
          {isCurrentDay
            ? "Добавить прием пищи"
            : `Посмотреть данные за ${format(selectedDate, "d MMMM", {
                locale: ru,
              })}`}
        </h2>
        {!isTodaySelected && (
          <p onClick={handleGoToToday} className="px-2 underline cursor-pointer">
            Перейти к добавлению продукта за сегодня
          </p>
        )}
        {meals.map((meal) => (
          <div
            onClick={() => handleMealClick(meal)}
            key={meal}
            className="group bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-slate-800">
                {meal === "breakfast" && "Завтрак"}
                {meal === "lunch" && "Обед"}
                {meal === "dinner" && "Ужин"}
                {meal === "snack" && "Перекус"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
