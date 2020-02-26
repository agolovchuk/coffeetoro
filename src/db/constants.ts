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
  product: {
    name: 'products',
    field: {
      name: 'name',
      categoryName: 'categoryName',
      barcode: 'barcode',
    }
  },
  category: {
    name: 'categories',
    field: {
      name: 'name',
    }
  },
  price: {
    name: 'prices',
    field: {
      id: 'id',
      productName: 'productName',
      unitId: 'unitId',
      expiryDate: 'expiryDate',
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
