
function categories() {
  return [
    {
      id: '1',
      title: 'Напитки',
      name: 'drink',
      parentName: undefined,
      sortIndex: 2,
      productsNest: true,
    },
    {
      id: '6',
      title: 'Какао',
      name: 'cacao',
      parentName: 'drink',
      sortIndex: 2,
      productsNest: true,
    },
    {
      id: '7',
      title: 'Десерты',
      name: 'diserts',
      parentName: undefined,
      sortIndex: 2,
      productsNest: true,
    },
    {
      id: '9',
      title: 'Кофе',
      name: 'coffee',
      parentName: undefined,
      sortIndex: 0,
      productsNest: true,
    },
    {
      id: '10',
      title: 'Чай',
      name: 'tea',
      parentName: undefined,
      sortIndex: 1,
      productsNest: true,
    },
  ]
}

function products() {
  return [
    {
      id: '1',
      title: 'Эспресо',
      name: 'espreso',
      categoryName: 'coffee',
    },
    {
      id: '2',
      title: 'Американо',
      name: 'americano',
      categoryName: 'coffee',
    },
    {
      id: '3',
      title: 'Лунго',
      name: 'lungo',
      categoryName: 'coffee',
    },
    {
      id: '4',
      title: 'Ристретто',
      name: 'ristretto',
      categoryName: 'coffee',
    },
    {
      id: '5',
      title: 'Доппио',
      name: 'doppio',
      categoryName: 'coffee',
    },
    {
      id: '6',
      title: 'Капучино',
      name: 'capuchino',
      categoryName: 'coffee',
    },
    {
      id: '7',
      title: 'Латте',
      name: 'latte',
      categoryName: 'coffee',
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
      title: '180 млл',
      name: '180'
    },
    '3': {
      id: '3',
      title: '250 млл',
      name: '250'
    },
    '4': {
      id: '4',
      title: '350 млл',
      name: '350'
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
      productName: 'latte',
      volumeId: '3',
      valuation: 23000,
      from: '2019-09-09T17:46:59.944Z',
      to: null,
    },
    {
      id: '6',
      productName: 'latte',
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
