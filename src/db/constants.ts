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
    name: 'product',
    field: {
      name: 'name',
      categoryName: 'categoryName',
      barcode: 'barcode',
    }
  },
  category: {
    name: 'category',
    field: {
      name: 'name',
    }
  },
  price: {
    name: 'price',
    field: {
      productName: 'productName',
      unitId: 'unitId',
      expiryDate: 'expiryDate',
    }
  },
  unit: {
    name: 'unit',
    field: {
      id: 'id',
      type: 'type',
    }
  },
};
