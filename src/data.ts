import type { productType } from "./types";

export const products: productType[] = [
  {
    date: "22.04.26",
    items: [
      {
        id: "1",
        meal: "breakfast",
        productName: "Кофе с молоком",
        calories: 50,
        proteins: 2,
        fats: 3,
        carbs: 4,
        weight: 200,
      },
      {
        id: "2",
        meal: "breakfast",
        productName: "Омлет",
        calories: 250,
        proteins: 15,
        fats: 18,
        carbs: 2,
        weight: 150,
      },
      {
        id: "3",
        meal: "lunch",
        productName: "Борщ",
        calories: 200,
        proteins: 8,
        fats: 10,
        carbs: 20,
        weight: 300,
      },
      {
        id: "4",
        meal: "snack",
        productName: "Орехи",
        calories: 150,
        proteins: 5,
        fats: 12,
        carbs: 3,
        weight: 30,
      },
    ],
  },
];
