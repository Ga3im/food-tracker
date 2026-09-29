import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setDailyGoals } from "../store/mealsSlice";
import { MacroGoalRow } from "../components/MacroGoalRow";
import { BackButton } from "../components/BackButton";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../pages/router";

export const SettingPage = () => {
  const { dailyGoals } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [protein, setProtein] = useState<boolean>(dailyGoals.proteins > 0 || false);
  const [fat, setFat] = useState<boolean>(dailyGoals.fats > 0 || false);
  const [carbs, setCarbs] = useState<boolean>(dailyGoals.carbs > 0 || false);
  const [calorie, setСalorie] = useState<boolean>(dailyGoals.calories > 0 || false);

  const handleBackClick = () => {
    navigate(routes.main);
  };

  const changeProtein = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, proteins: value }));
  };

  const changeFat = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, fats: value }));
  };

  const changeCarb = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, carbs: value }));
  };

  const changeCals = (value: number) => {
    dispatch(setDailyGoals({ ...dailyGoals, calories: value }));
  };

  return (
    <div className="px-4">
      <BackButton onBackClick={handleBackClick} />

      <div className="p-2">
        <h2>Настройки</h2>
        <div>
          <h2>Дневная норма нутриентов</h2>
          <MacroGoalRow
            unit="гр"
            isChecked={protein}
            onChangeCheckbox={() => setProtein(!protein)}
            value={dailyGoals.proteins}
            onChange={changeProtein}
          >
            Белки
          </MacroGoalRow>
          <MacroGoalRow
            unit="гр"
            isChecked={fat}
            onChange={changeFat}
            value={dailyGoals.fats}
            onChangeCheckbox={() => setFat(!fat)}
          >
            Жиры
          </MacroGoalRow>
          <MacroGoalRow
            unit="гр"
            isChecked={carbs}
            onChange={changeCarb}
            value={dailyGoals.carbs}
            onChangeCheckbox={() => setCarbs(!carbs)}
          >
            Углеводы
          </MacroGoalRow>
          <MacroGoalRow
            unit="Ккал"
            isChecked={calorie}
            value={dailyGoals.calories}
            onChange={changeCals}
            onChangeCheckbox={() => setСalorie(!calorie)}
          >
            Калории
          </MacroGoalRow>
        </div>
      </div>
      <Link className="inline-block text-[#0600ff] underline active:text-[#0400b3] active:scale-95" to="database">
        Настроить базу данных
      </Link>
    </div>
  );
};
