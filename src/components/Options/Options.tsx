import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../../hooks/useIsDesktop";
import { useAppDispatch, useAppSelector } from "../../store";
import { setNutritional } from "../../store/mealsSlice";
import type { mealType } from "../../types";

export const Options = () => {
  const { nutritional } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();
  const meals: mealType[] = ["breakfast", "lunch", "dinner"];
  const { isDesktop } = useIsDesktop();
  const navigate = useNavigate();

  const handleMealClick = (meal: mealType) => {
    navigate(`/meal/${meal}`);
    dispatch(setNutritional({ ...nutritional, meal: meal }));
  };

  const handleAddSnack = () => {
    navigate(`/meal/snack`);
    dispatch(setNutritional({ ...nutritional, meal: "snack" }));
  };

  return (
    <div className="px-2">
      <div className="grid gap-3 pb-[20px]">
        <h2 className="px-2">Добавить прием пищи</h2>
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
              </span>
            </div>
          </div>
        ))}
        {isDesktop && (
          <div
            onClick={handleAddSnack}
            className="group bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:shadow-md transition-shadow"
          >
            <span className="text-lg font-semibold text-slate-800">
              Перекус
            </span>
          </div>
        )}
      </div>
      <div className="fixed bottom-6 left-0 right-0 px-4 md:hidden">
        <button
          onClick={handleAddSnack}
          className="max-w-md mx-auto w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-transform active:scale-[0.98] shadow-xl shadow-indigo-200"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Добавить перекус</span>
        </button>
      </div>
    </div>
  );
};
