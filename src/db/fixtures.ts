import { CategoryItem, UnitItem } from 'domain/dictionary/Types';
import { IEnv } from 'domain/env';
import { User } from 'domain/users';

export const categories: ReadonlyArray<Partial<CategoryItem>> = [
  {
    title: 'Кофе',
    name: 'coffee',
    sortIndex: 1,
    parentId: 'root',
  },
  {
    title: 'Чай',
    name: 'tea',
    sortIndex: 2,
    parentId: 'root',
  },
  {
    title: 'Напитки',
    name: 'drink',
    sortIndex: 3,
    parentId: 'root',
  },
  {
    title: 'Десерты',
    name: 'dessert',
    sortIndex: 4,
    parentId: 'root',
  },
  {
    title: 'Эспрессо',
    name: 'espresso',
    parentId: 'coffee',
    sortIndex: 1,
  },
  {
    title: 'Американо',
    name: 'americano',
    parentId: 'coffee',
    sortIndex: 2,
  },
  {
    title: 'Лунго',
    name: 'longo',
    parentId: 'coffee',
    sortIndex: 3,
  },
  {
    title: 'Ристретто',
    name: 'ristretto',
    parentId: 'coffee',
    sortIndex: 4,
  },
  {
    title: 'Доппио',
    name: 'doppio',
    parentId: 'coffee',
    sortIndex: 5,
  },
  {
    title: 'Капучино',
    name: 'cappuccino',
    parentId: 'coffee',
    sortIndex: 6,
  },
  {
    title: 'Латте',
    name: 'latte',
    parentId: 'coffee',
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
