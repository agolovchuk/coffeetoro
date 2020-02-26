import { CategoryItem, ProductItem, UnitItem } from 'domain/dictionary/Types';
export const categories: ReadonlyArray<Partial<CategoryItem>> = [
  {
    id: '1',
    title: 'Кофе',
    name: 'coffee',
    sortIndex: 1,
  },
  {
    id: '2',
    title: 'Чай',
    name: 'tea',
    sortIndex: 2,
  },
  {
    id: '3',
    title: 'Напитки',
    name: 'drink',
    sortIndex: 3,
  },
  {
    id: '4',
    title: 'Десерты',
    name: 'dessert',
    sortIndex: 4,
  },
];

export const products: ReadonlyArray<Partial<ProductItem>> = [
  {
    id: '1',
    title: 'Эспрессо',
    name: 'espresso',
    categoryName: 'coffee',
    sortIndex: 1,
  },
  {
    id: '2',
    title: 'Американо',
    name: 'americano',
    categoryName: 'coffee',
    sortIndex: 2,
  },
  {
    id: '3',
    title: 'Лунго',
    name: 'longo',
    categoryName: 'coffee',
    sortIndex: 3,
  },
  {
    id: '4',
    title: 'Ристретто',
    name: 'ristretto',
    categoryName: 'coffee',
    sortIndex: 4,
  },
  {
    id: '5',
    title: 'Доппио',
    name: 'doppio',
    categoryName: 'coffee',
    sortIndex: 5,
  },
  {
    id: '6',
    title: 'Капучино',
    name: 'cappuccino',
    categoryName: 'coffee',
    sortIndex: 6,
  },
  {
    id: '7',
    title: 'Латте',
    name: 'latte',
    categoryName: 'coffee',
    sortIndex: 7,
  },
];

export const units: ReadonlyArray<Partial<UnitItem>> = [
  {
    id: '1',
    name: 'instance',
    title: 'pcs',
    type: 'countable',
    sortIndex: 1,
  },
  {
    id: '2',
    name: 'wight',
    title: 'g',
    type: 'weight',
    sortIndex: 2,
  },
  {
    id: '3',
    name: '110',
    title: '110 ml',
    type: 'countable',
    sortIndex: 3,
  },
  {
    id: '4',
    name: '180',
    title: '180 ml',
    type: 'countable',
    sortIndex: 4,
  },
  {
    id: '5',
    name: '250',
    title: '250 ml',
    type: 'countable',
    sortIndex: 5,
  },
  {
    id: '6',
    name: '350',
    title: '350 ml',
    type: 'countable',
    sortIndex: 6,
  },
  {
    id: '7',
    name: '450',
    title: '450 ml',
    type: 'countable',
    sortIndex: 7,
  }
]
