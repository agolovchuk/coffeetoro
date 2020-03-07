import { CategoryItem, UnitItem } from 'domain/dictionary/Types';
import { IEnv } from 'domain/env';
import { User } from 'domain/users';

export const categories: ReadonlyArray<Partial<CategoryItem>> = [
  {
    title: 'Кофе',
    name: 'coffee',
    sortIndex: 1,
    parentName: 'root',
  },
  {
    title: 'Чай',
    name: 'tea',
    sortIndex: 2,
    parentName: 'root',
  },
  {
    title: 'Напитки',
    name: 'drink',
    sortIndex: 3,
    parentName: 'root',
  },
  {
    title: 'Десерты',
    name: 'dessert',
    sortIndex: 4,
    parentName: 'root',
  },
  {
    title: 'Эспрессо',
    name: 'espresso',
    parentName: 'coffee',
    sortIndex: 1,
  },
  {
    title: 'Американо',
    name: 'americano',
    parentName: 'coffee',
    sortIndex: 2,
  },
  {
    title: 'Лунго',
    name: 'longo',
    parentName: 'coffee',
    sortIndex: 3,
  },
  {
    title: 'Ристретто',
    name: 'ristretto',
    parentName: 'coffee',
    sortIndex: 4,
  },
  {
    title: 'Доппио',
    name: 'doppio',
    parentName: 'coffee',
    sortIndex: 5,
  },
  {
    title: 'Капучино',
    name: 'cappuccino',
    parentName: 'coffee',
    sortIndex: 6,
  },
  {
    title: 'Латте',
    name: 'latte',
    parentName: 'coffee',
    sortIndex: 7,
  },
];

export const units: ReadonlyArray<UnitItem> = [
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
];

export const env: ReadonlyArray<IEnv> = [
  {
    id: 'default',
    multiplier: 1000,
    currency: 'UAH',
    user: null,
    firebaseConfig: null,
  }
];

export const users: ReadonlyArray<User> = [
  {
    hash: "djAxJrBFo+ufzDLOY7B6XMeH8A9CQF7l3OCtzalbuPZ8QlktbBDb1zYb8xf7eBnubncBfYDo",
    role: "manager",
    name: "Manager",
    id: "_DOZWB_w",
    firstName: "",
    lastName: "",
    ava: "",
    lang: "ru",
  }
]
