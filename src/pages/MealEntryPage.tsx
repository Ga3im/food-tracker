import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setNutritional } from "../store/mealsSlice";
import { BackButton } from "../components/BackButton";
import { MealList } from "../components/MealList/MealList";
import { Form } from "../components/Form/Form";
import { useNavigate } from "react-router-dom";

export const MealEntryPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(true);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const { nutritional } = useAppSelector((state) => state.meal);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    if (formContainerRef.current) {
      observer.observe(formContainerRef.current);
    }

    return () => {
      if (formContainerRef.current) {
        observer.unobserve(formContainerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const id = crypto.randomUUID();
    dispatch(setNutritional({ ...nutritional, id: id }));
  }, []);

  const handleBackClick = () => {
    navigate(-1);
    dispatch(setNutritional({ ...nutritional, meal: null }));
  };

  const scrollToForm = () => {
    formContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans antialiased pb-10">
      <BackButton onBackClick={handleBackClick} />

      <div className="max-w-6xl mx-auto px-4 mt-2">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-6">
          {(nutritional.meal === "breakfast" && "Завтрак") ||
            (nutritional.meal === "lunch" && "Обед") ||
            (nutritional.meal === "dinner" && "Ужин") ||
            (nutritional.meal === "snack" && "Перекус")}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <MealList />
          </div>

          <div
            ref={formContainerRef}
            className="lg:col-span-5 lg:sticky lg:top-6 w-full"
          >
            <Form />
          </div>
        </div>
      </div>

      <button
        onClick={scrollToForm}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-2 
          bg-indigo-600 hover:bg-indigo-700 active:scale-95
          text-white text-sm font-bold 
          px-5 py-3 rounded-full shadow-lg shadow-indigo-200
          transition-all duration-300 transform
          ${
            !isFormVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-90 pointer-events-none"
          }
        `}
      >
        <span>Добавить продукт</span>
      </button>
    </div>
  );
};
