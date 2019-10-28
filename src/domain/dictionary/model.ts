
function categories() {
  return [
    {
      id: '1',
      title: 'Напитки',
      name: 'drink',
      parentName: null,
    },
    {
      id: '2',
      title: 'Развесное',
      name: 'dry',
      parentName: null,
    },
    {
      id: '3',
      title: 'С молоком',
      name: 'milk',
      parentName: 'drink',
    },
    {
      id: '4',
      title: 'Без молока',
      name: 'no-milk',
      parentName: 'drink',
    },
    {
      id: '5',
      title: 'Чай',
      name: 'tea',
      parentName: 'drink',
    },
    {
      id: '6',
      title: 'Какао',
      name: 'cacao',
      parentName: 'drink',
    },
    {
      id: '7',
      title: 'Десерты',
      name: 'diserts',
      parentName: 'drink',
    },
    {
      id: '8',
      title: 'Топинги',
      name: 'topings',
      parentName: 'drink',
    },
    {
      id: '9',
      title: 'Кофе',
      name: 'coffee',
      parentName: 'dry',
    },
    {
      id: '10',
      title: 'Чай',
      name: 'tea',
      parentName: 'dry',
    },
  ]
}

function products() {
  return [
    {
      id: '1',
      title: 'Эспресо',
      name: 'espreso',
      categoryName: 'no-milk',
    },
    {
      id: '2',
      title: 'Американо',
      name: 'americano',
      categoryName: 'no-milk',
    },
    {
      id: '3',
      title: 'Лунго',
      name: 'lungo',
      categoryName: 'no-milk',
    },
    {
      id: '4',
      title: 'Ристретто',
      name: 'ristretto',
      categoryName: 'no-milk',
    },
    {
      id: '5',
      title: 'Доппио',
      name: 'doppio',
      categoryName: 'no-milk',
    },
    {
      id: '6',
      title: 'Капучино',
      name: 'capuchino',
      categoryName: 'milk',
    },
    {
      id: '7',
      title: 'Латте',
      name: 'Latte',
      categoryName: 'milk',
    },
  ]
}

function volume() {
  return {
    '1': {
      id: '1',
      title: '110 млл',
      name: '110',
    },
    '2': {
      id: '2',
      title: '185 млл',
      name: '185'
    },
    '3': {
      id: '3',
      title: '250 млл',
      name: '250'
    },
    '4': {
      id: '4',
      title: '330 млл',
      name: '330'
    },
    '5': {
      id: '5',
      title: '450 млл',
      name: '450'
    }
  };
}

function prices() {
  return [
    {
      id: '1',
      productName: 'espreso',
      volumeId: '1',
      valuation: 14000,
      from: '2019-09-09T17:46:59.944Z',
      to: null,
    },
    {
      id: '2',
      productName: 'americano',
      volumeId: '2',
      valuation: 14000,
      from: '2019-09-09T17:46:59.944Z',
      to: null,
    },
    {
      id: '3',
      productName: 'capuchino',
      volumeId: '2',
      valuation: 17000,
      from: '2019-09-09T17:46:59.944Z',
      to: null,
    },
    {
      id: '4',
      productName: 'capuchino',
      volumeId: '3',
      valuation: 23000,
      from: '2019-09-09T17:46:59.944Z',
      to: null,
    },
    {
      id: '5',
      productName: 'Latte',
      volumeId: '3',
      valuation: 23000,
      from: '2019-09-09T17:46:59.944Z',
      to: null,
    },
    {
      id: '6',
      productName: 'Latte',
      volumeId: '4',
      valuation: 29000,
      from: '2019-09-09T17:46:59.944Z',
      to: null,
    },
  ]
}

type Action = {
  type: string,
} 


export const reducer = {
  categories(state = categories(), action: Action) {
    switch (action.type) {

      default:
        return state;
    }
  },

  products(state = products(), action: Action) {
    switch (action.type) {

      default:
        return state;
    }
  },
  
  volume(state = volume(), action: Action) {
    switch (action.type) {

      default:
        return state;
    }
  },

  prices(state = prices(), action: Action) {
    switch (action.type) {

      default:
        return state;
    }
  },
};
