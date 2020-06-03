export const DB_NAME = 'cachebox';
export const READ_WRITE = 'readwrite';
export const READ_ONLY = 'readonly';

export const TABLE = {
  orders: {
    name: 'orders',
    field: {
      id: 'id',
      payment: 'payment',
      client: 'client',
      owner: 'owner',
      orderIdPayment: 'orderIdPayment',
    },
  },
  orderItem: {
    name: 'orderItem',
    field: {
      id: 'id',
      orderId: 'orderId',
      priceId: 'priceId',
    },
  },
  discountItem: {
    name: 'discountItem',
    index: {
      orderId: 'orderId',
      discountId: 'discountId',
    }
  },
  category: {
    name: 'categories',
    index: {
      id: 'id',
      name: 'name',
      parentId: 'parentId',
    },
  },
  price: {
    name: 'prices',
    index: {
      id: 'id',
      parentId: 'parentId',
      expiry: 'expiry',
      type: 'type',
      barcode: 'barcode',
      priceId: 'priceId', // Synthetic index
    },
  },
  unit: {
    name: 'units',
    field: {
      id: 'id',
      type: 'type',
    },
  },
  users: {
    name: 'users',
    index: {
      id: 'id',
    },
  },
  env: {
    name: 'env',
    index: {
      id: 'id',
    },
  },
  tmc: {
    name: 'tmc',
    index: {
      id: 'id',
      parentId: 'parentId',
      barcode: 'barcode',
    },
  },
  processCards: {
    name: 'processCards',
    index: {
      id: 'id',
      parentId: 'parentId',
    },
  },
  groupArticles: {
    name: 'groupArticles',
    index: {
      id: 'id',
      title: 'title',
    },
  },
  expenses: {
    name: 'expenses',
    index: {
      id: 'id',
      foreignId: 'foreignId',
      barcode: 'barcode',
    }
  },
  services: {
    name: 'services',
    index: {
      id: 'id',
    }
  }
};
