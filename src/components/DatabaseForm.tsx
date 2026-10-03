import React, { useState, type Dispatch, type SetStateAction } from "react";
import { addProductToDatabaseOffline, useAppDispatch, useAppSelector } from "../store";
import { macronutrients } from "./Form";
import type { BaseProduct } from "../types";

const CloseIcon = () => (
  <svg
    className="rotate-45"
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
);

type DatabaseFormType = {
  setIsOpenForm: Dispatch<SetStateAction<boolean>>;
};

type NutrientKeys = "proteins" | "fats" | "carbs" | "calories";

export const DatabaseForm = ({ setIsOpenForm }: DatabaseFormType) => {
  const [isError, setIsError] = useState<boolean>(false);

  const [newProduct, setNewProduct] = useState<BaseProduct>({
    id: crypto.randomUUID(),
    name: "",
    calories: '',
    proteins: '',
    fats: '',
    carbs: '',
  });

  const { isDirectInput } = useAppSelector((state) => state.meal);
  const dispatch = useAppDispatch();
  const handleCloseForm = () => {
    setIsOpenForm(false);
  };

  const isFormInvalid =
    !newProduct.name.trim() ||
    +newProduct.calories <= 0 ||
    +newProduct.proteins < 0 ||
    +newProduct.fats < 0 ||
    +newProduct.carbs < 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) {
      setIsError(true);
      return;
    }

    dispatch(addProductToDatabaseOffline(newProduct));
    setIsError(false);
    setNewProduct({
      id: crypto.randomUUID(),
      name: "",
      calories: '',
      proteins: '',
      fats: '',
      carbs: '',
    });
  };

  const handleNameChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, name: value }));
  };

  const handleNutrientChange = (key: NutrientKeys, value: string) => {
    const numericValue = value === "" ? 0 : Number(value);
    setNewProduct((prev) => ({ ...prev, [key]: numericValue }));
  };

  const handleCaloriesChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, calories: Number(value) }));
  };

  return (
    <div className="px-4 fixed bottom-4 left-0 right-0 max-w">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden text-start">
        <div className="p-3.5 bg-indigo-600 text-white flex justify-between items-center">
          <h2 className="text-sm font-bold tracking-wide uppercase">Добавление продукта в базу данных</h2>
          <button onClick={handleCloseForm} className="cursor-pointer">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Название продукта</label>
            <input
              value={newProduct.name}
              placeholder="Название"
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full bg-slate-50 border rounded-xl px-3 py-2 outline-none focus:border-indigo-500 transition-all text-sm font-medium ${
                isError && !newProduct.name.trim() ? "border-red-500" : "border-slate-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
              {isDirectInput ? "Итоговые КБЖУ за весь вес" : "КБЖУ за 100 гр"}
            </label>

            <div className="grid grid-cols-4 gap-1.5">
              {macronutrients.map((mn) => {
                const nutrientKey = mn.nameEN as NutrientKeys;
                const currentValue = newProduct[nutrientKey];

                return (
                  <div key={mn.id} className="flex flex-col">
                    <input
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleNutrientChange(nutrientKey, e.target.value)}
                      value={currentValue}
                      step="any"
                      type="number"
                      min={0}
                      placeholder={mn.name}
                      className={`w-full bg-slate-50 border rounded-lg px-2 py-1.5 text-center outline-none focus:border-indigo-500 text-xs font-bold transition-colors ${
                        isError && +currentValue <= 0 ? "border-red-500" : "border-slate-200"
                      }`}
                    />
                    <span className="text-[9px] text-center text-slate-400 font-bold mt-0.5">{mn.name}</span>
                  </div>
                );
              })}

              <div className="flex flex-col">
                <input
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => handleCaloriesChange(e.target.value)}
                  value={newProduct.calories}
                  step="any"
                  min={0}
                  type="number"
                  placeholder="Ккал"
                  className={`w-full bg-slate-50 border rounded-lg px-1 py-1.5 text-center outline-none focus:border-indigo-500 text-xs font-bold transition-colors ${
                    isError && +newProduct.calories <= 0 ? "border-red-500" : "border-slate-200"
                  }`}
                />
                <span className="text-[9px] text-center text-indigo-600 font-bold mt-0.5">Ккал</span>
              </div>
            </div>
          </div>

          <div className="pt-1 space-y-2">
            <button
              disabled={isFormInvalid}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md active:scale-[0.99] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Добавить в базу данных
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
