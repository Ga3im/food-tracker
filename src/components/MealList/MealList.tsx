import { format } from "date-fns";
import { useAppSelector } from "../../store";

export const MealList = () => {
  const { product, nutritional } = useAppSelector((state) => state.meal);

  const selectedDate = new Date();

  const dateKey = format(selectedDate, "dd.MM.yy");
  const dayData = product.find((p) => p.date === dateKey);

  // 2. Фильтруем только те продукты, которые относятся к текущей странице (например, только завтраки)
  const filteredItems =
    dayData?.items.filter((item) => item.meal === nutritional.meal) || [];

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
                  className="border-b border-slate-50 pb-3 last:border-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800">
                      {item.productName}
                    </span>
                    <span className="font-black text-indigo-600">
                      {item.calories} ккал
                    </span>
                  </div>
                  <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    <span>Вес: {item.weight}г</span>
                    <span>Б: {item.proteins}г</span>
                    <span>Ж: {item.fats}г</span>
                    <span>У: {item.carbs}г</span>
                  </div>
                </div>
              ))}

              {/* Мини-итог только для этого приема пищи */}
              <div className="mt-6 pt-4 border-t-2 border-slate-50">
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>Итого за этот прием:</span>
                  <span className="text-slate-800">
                    {filteredItems.reduce((sum, i) => sum + i.calories, 0)} ккал
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
