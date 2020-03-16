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
    }
  },
  orderItem: {
    name: 'orderItem',
    field: {
      id: 'id',
      orderId: 'orderId',
      priceId: 'priceId',
    }
  },
  category: {
    name: 'categories',
    index: {
      id: 'id',
      name: 'name',
      parentId: 'parentId',
    }
  },
  price: {
    name: 'prices',
    index: {
      id: 'id',
      categoryId: 'categoryId',
      unitId: 'unitId',
      expiryDate: 'expiryDate',
      barcode: 'barcode',
    }
  },
  unit: {
    name: 'units',
    field: {
      id: 'id',
      type: 'type',
    }
  },
  users: {
    name: 'users',
    index: {
      id: 'id',
    }
  },
  env: {
    name: 'env',
    index: {
      id: 'id',
    }
  }
};
