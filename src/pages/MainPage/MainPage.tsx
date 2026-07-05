import { Dashboard } from "../../components/Dashboard/Dashboard";
import { Hedaer } from "../../components/Header/Header";
import { MealEntry } from "../../components/MealEntry/MealEntry";
import { useAppSelector } from "../../store";

export const MainPage = () => {
  const { nutritional } = useAppSelector((state) => state.meal);
  return (
    <>
      <Hedaer />
      {nutritional.meal === null ? <Dashboard /> : <MealEntry />}
    </>
  );
};
