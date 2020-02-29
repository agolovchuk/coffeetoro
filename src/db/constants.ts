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
    field: {
      name: 'name',
      parentName: 'parentName',
    }
  },
  price: {
    name: 'prices',
    field: {
      id: 'id',
      categoryName: 'categoryName',
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
};
