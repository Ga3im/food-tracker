import { useState } from "react";
import { MacroGoalRow } from "../MacroGoalRow/MacroGoalRow";
import { useAppDispatch, useAppSelector } from "../../store";
import { setDailyGoals } from "../../store/mealsSlice";

export const Setting = () => {
  const { dailyGoals } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();

  const [protein, setProtein] = useState<boolean>(
    dailyGoals.protein > 0 || false
  );
  const [fat, setFat] = useState<boolean>(dailyGoals.fat > 0 || false);
  const [carbs, setCarbs] = useState<boolean>(dailyGoals.carb > 0 || false);
  const [calorie, setСalorie] = useState<boolean>(dailyGoals.cals > 0 || false);

  const changeProtein = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, protein: value }));
  };

  const changeFat = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, fat: value }));
  };

  const changeCarb = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, carb: value }));
  };

  const changeCals = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, cals: value }));
  };

  return (
    <div className="p-2">
      <h2>Настройки</h2>
      <div>
        <h2>Дневная норма нутриентов</h2>
        <MacroGoalRow
          unit="гр"
          isChecked={protein}
          onChangeCheckbox={() => setProtein(!protein)}
          value={dailyGoals.protein}
          onChange={changeProtein}
        >
          Белки
        </MacroGoalRow>
        <MacroGoalRow
          unit="гр"
          isChecked={fat}
          onChange={changeFat}
          value={dailyGoals.fat}
          onChangeCheckbox={() => setFat(!fat)}
        >
          Жиры
        </MacroGoalRow>
        <MacroGoalRow
          unit="гр"
          isChecked={carbs}
          onChange={changeCarb}
          value={dailyGoals.carb}
          onChangeCheckbox={() => setCarbs(!carbs)}
        >
          Углеводы
        </MacroGoalRow>
        <MacroGoalRow
          unit="Ккал"
          isChecked={calorie}
          value={dailyGoals.cals}
          onChange={changeCals}
          onChangeCheckbox={() => setСalorie(!calorie)}
        >
          Калории
        </MacroGoalRow>
      </div>
    </div>
  );
};
