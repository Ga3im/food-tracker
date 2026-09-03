import type { ProductGroup } from "./types";

export const products: ProductGroup[] = [
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

export interface BaseProduct {
  name: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export const foodDatabase: BaseProduct[] = [
  // === МЯСО И ПТИЦА ===
  {
    name: "Куриное филе (сырое)",
    calories: 113,
    proteins: 23.6,
    fats: 1.9,
    carbs: 0,
  },
  {
    name: "Куриное филе (отварное)",
    calories: 153,
    proteins: 30.4,
    fats: 3.5,
    carbs: 0,
  },
  {
    name: "Куриное бедро (без кожи)",
    calories: 130,
    proteins: 19.0,
    fats: 6.0,
    carbs: 0,
  },
  {
    name: "Индейка (филе)",
    calories: 115,
    proteins: 24.1,
    fats: 2.0,
    carbs: 0,
  },
  {
    name: "Говядина нежирная",
    calories: 158,
    proteins: 22.2,
    fats: 7.1,
    carbs: 0,
  },
  {
    name: "Свинина вырезка",
    calories: 142,
    proteins: 20.0,
    fats: 7.0,
    carbs: 0,
  },
  {
    name: "Фарш домашний (говядина+свинина)",
    calories: 254,
    proteins: 17.2,
    fats: 20.5,
    carbs: 0,
  },

  // === РЫБА И МОРЕПРОДУКТЫ ===
  { name: "Горбуша", calories: 142, proteins: 20.5, fats: 6.5, carbs: 0 },
  {
    name: "Сёмга / Лосось",
    calories: 208,
    proteins: 20.0,
    fats: 14.0,
    carbs: 0,
  },
  { name: "Треска филе", calories: 78, proteins: 17.7, fats: 0.7, carbs: 0 },
  { name: "Минтай филе", calories: 72, proteins: 15.9, fats: 0.9, carbs: 0 },
  {
    name: "Креветки очищенные",
    calories: 95,
    proteins: 19.0,
    fats: 2.0,
    carbs: 0,
  },
  { name: "Кальмары", calories: 100, proteins: 18.0, fats: 2.2, carbs: 0 },
  {
    name: "Тунец консервированный (в собств. соку)",
    calories: 96,
    proteins: 21.0,
    fats: 1.2,
    carbs: 0,
  },

  // === КРУПЫ, МАКАРОНЫ И БОБОВЫЕ (СУХОЙ ПРОДУКТ) ===
  {
    name: "Гречневая крупа (сухая)",
    calories: 330,
    proteins: 12.6,
    fats: 3.3,
    carbs: 62.0,
  },
  {
    name: "Рис белый (сухой)",
    calories: 344,
    proteins: 6.7,
    fats: 0.7,
    carbs: 78.9,
  },
  {
    name: "Овсяные хлопья «Геркулес» (сухие)",
    calories: 352,
    proteins: 12.3,
    fats: 6.2,
    carbs: 61.8,
  },
  {
    name: "Макароны (из твердых сортов, сухие)",
    calories: 344,
    proteins: 12.0,
    fats: 1.5,
    carbs: 71.0,
  },
  {
    name: "Чечевица (сухая)",
    calories: 297,
    proteins: 24.0,
    fats: 1.5,
    carbs: 46.3,
  },
  {
    name: "Нут (сухой)",
    calories: 364,
    proteins: 19.0,
    fats: 6.0,
    carbs: 60.0,
  },

  // === ГОТОВЫЕ ГАРНИРЫ ===
  {
    name: "Гречка отварная на воде",
    calories: 105,
    proteins: 4.0,
    fats: 1.0,
    carbs: 21.0,
  },
  {
    name: "Рис отварной",
    calories: 116,
    proteins: 2.2,
    fats: 0.5,
    carbs: 24.9,
  },
  {
    name: "Макароны отварные",
    calories: 130,
    proteins: 4.5,
    fats: 0.6,
    carbs: 26.0,
  },
  {
    name: "Овсяная каша на воде",
    calories: 88,
    proteins: 3.0,
    fats: 1.7,
    carbs: 15.0,
  },
  {
    name: "Картофельное пюре (на молоке, без масла)",
    calories: 90,
    proteins: 2.0,
    fats: 1.2,
    carbs: 16.0,
  },
  {
    name: "Картофель запеченный",
    calories: 93,
    proteins: 2.0,
    fats: 0.4,
    carbs: 21.0,
  },

  // === ЯЙЦА И МОЛОЧНЫЕ ПРОДУКТЫ ===
  {
    name: "Яйцо куриное (1 шт)",
    calories: 74,
    proteins: 6.5,
    fats: 5.5,
    carbs: 0.4,
  },
  {
    name: "Яичный белок (1 шт)",
    calories: 17,
    proteins: 11.1,
    fats: 0.2,
    carbs: 0.7,
  },
  { name: "Творог 5%", calories: 121, proteins: 17.2, fats: 5.0, carbs: 1.8 },
  { name: "Творог 0%", calories: 71, proteins: 16.5, fats: 0.2, carbs: 1.3 },
  { name: "Молоко 2.5%", calories: 54, proteins: 2.9, fats: 2.5, carbs: 4.8 },
  { name: "Кефир 1%", calories: 40, proteins: 2.8, fats: 1.0, carbs: 4.0 },
  {
    name: "Йогурт натуральный 2%",
    calories: 60,
    proteins: 4.5,
    fats: 2.0,
    carbs: 3.5,
  },
  {
    name: "Сыр Российский",
    calories: 363,
    proteins: 23.0,
    fats: 29.5,
    carbs: 0,
  },
  {
    name: "Сыр Моцарелла",
    calories: 240,
    proteins: 18.0,
    fats: 18.0,
    carbs: 1.0,
  },
  { name: "Сметана 15%", calories: 162, proteins: 2.6, fats: 15.0, carbs: 3.0 },

  // === ХЛЕБ И ВЫПЕЧКА ===
  { name: "Хлеб ржаной", calories: 215, proteins: 6.5, fats: 1.2, carbs: 43.0 },
  {
    name: "Хлеб пшеничный (белый)",
    calories: 262,
    proteins: 7.5,
    fats: 2.5,
    carbs: 50.0,
  },
  {
    name: "Хлебцы цельнозерновые",
    calories: 320,
    proteins: 10.0,
    fats: 2.5,
    carbs: 62.0,
  },
  {
    name: "Лаваш армянский (тонкий)",
    calories: 275,
    proteins: 8.0,
    fats: 1.0,
    carbs: 56.0,
  },

  // === ОВОЩИ И ЗЕЛЕНЬ ===
  { name: "Огурцы свежие", calories: 15, proteins: 0.8, fats: 0.1, carbs: 2.8 },
  {
    name: "Помидоры свежие",
    calories: 20,
    proteins: 0.6,
    fats: 0.2,
    carbs: 4.2,
  },
  {
    name: "Капуста белокочанная",
    calories: 27,
    proteins: 1.8,
    fats: 0.1,
    carbs: 4.7,
  },
  {
    name: "Перец болгарский сладкий",
    calories: 26,
    proteins: 1.3,
    fats: 0.0,
    carbs: 5.3,
  },
  {
    name: "Брокколи свежая",
    calories: 34,
    proteins: 2.8,
    fats: 0.4,
    carbs: 6.7,
  },
  {
    name: "Морковь свежая",
    calories: 41,
    proteins: 1.3,
    fats: 0.1,
    carbs: 6.9,
  },
  { name: "Лук репчатый", calories: 41, proteins: 1.4, fats: 0.0, carbs: 10.4 },
  { name: "Красный лук", calories: 42, proteins: 1.1, fats: 0.2, carbs: 8.5 },
  { name: "Чеснок", calories: 149, proteins: 6.5, fats: 0.5, carbs: 29.9 },
  { name: "Листья салата", calories: 12, proteins: 1.2, fats: 0.3, carbs: 1.3 },

  // === ФРУКТЫ И ЯГОДЫ ===
  { name: "Банан", calories: 89, proteins: 1.5, fats: 0.2, carbs: 21.8 },
  { name: "Яблоко", calories: 52, proteins: 0.4, fats: 0.4, carbs: 9.8 },
  { name: "Груша", calories: 47, proteins: 0.4, fats: 0.3, carbs: 10.3 },
  { name: "Апельсин", calories: 43, proteins: 0.9, fats: 0.2, carbs: 8.1 },
  { name: "Авокадо", calories: 160, proteins: 2.0, fats: 14.7, carbs: 1.8 },
  { name: "Клубника", calories: 32, proteins: 0.8, fats: 0.4, carbs: 7.5 },
  {
    name: "Черника / Голубика",
    calories: 44,
    proteins: 1.0,
    fats: 0.5,
    carbs: 11.0,
  },
  { name: "Арбуз", calories: 30, proteins: 0.7, fats: 0.1, carbs: 6 },

  // === ОРЕХИ, СЕМЕНА И МАСЛА ===
  {
    name: "Орехи грецкие",
    calories: 654,
    proteins: 15.2,
    fats: 65.2,
    carbs: 7.0,
  },
  { name: "Миндаль", calories: 645, proteins: 18.6, fats: 57.7, carbs: 13.0 },
  { name: "Арахис", calories: 552, proteins: 26.3, fats: 45.2, carbs: 9.9 },
  {
    name: "Семечки подсолнечника (очищ.)",
    calories: 578,
    proteins: 20.7,
    fats: 52.9,
    carbs: 5.0,
  },
  {
    name: "Масло подсолнечное",
    calories: 899,
    proteins: 0,
    fats: 99.9,
    carbs: 0,
  },
  { name: "Масло оливковое", calories: 898, proteins: 0, fats: 99.8, carbs: 0 },
  {
    name: "Масло сливочное 82.5%",
    calories: 748,
    proteins: 0.5,
    fats: 82.5,
    carbs: 0.8,
  },

  // === НАПИТКИ ===
  {
    name: "Кофе черный (без сахара и молока)",
    calories: 2,
    proteins: 0.2,
    fats: 0.0,
    carbs: 0.3,
  },
  {
    name: "Чай черный / зеленый (без сахара)",
    calories: 1,
    proteins: 0.1,
    fats: 0.0,
    carbs: 0.0,
  },
  {
    name: "Сок апельсиновый пакетированный",
    calories: 45,
    proteins: 0.7,
    fats: 0.2,
    carbs: 10.2,
  },
  {
    name: "Кока-Кола (классическая)",
    calories: 42,
    proteins: 0,
    fats: 0,
    carbs: 10.6,
  },
  {
    name: "Кока-Кола Зеро (без сахара)",
    calories: 0.3,
    proteins: 0,
    fats: 0,
    carbs: 0,
  },

  // === СОУСЫ И СПЕЦИИ ===
  { name: "Кетчуп", calories: 93, proteins: 1.8, fats: 1.0, carbs: 22.0 },
  { name: "Майонез 67%", calories: 624, proteins: 3.1, fats: 67.0, carbs: 2.6 },
  { name: "Соевый соус", calories: 53, proteins: 6.0, fats: 0.6, carbs: 6.6 },
];
