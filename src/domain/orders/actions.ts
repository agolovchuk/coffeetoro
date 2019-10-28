// import { asyncAction } from 'lib/actionsHelper';

// export const AddOrderItem = asyncAction(
//   'ORDER/ADD_ORDER_ITEM',
//   (priceId: string, quantity: number) => ({ payload: { priceId, quantity }}),
// );

export const ADD_ITEM = 'ORDER/ADD_ITEM';
export const UPDATE_QUANTITY = 'ORDER/UPDATE_QUANTITY';
export const UPDATE_ITEM = 'ORDER/UPDATE_ITEM';
export const REMOVE_ITEM = 'ORDER/REMOVE_ITEM';

interface IAddItem {
  type: typeof ADD_ITEM,
  payload: {
    id: string,
    priceId: string,
    quantity: number,
  }
}

export function addItemAction(id: string, priceId: string, quantity: number): IAddItem {
  return {
    type: ADD_ITEM,
    payload: {
      id,
      priceId,
      quantity,
    }
  }
}

interface UpdateQuantity {
  type: typeof UPDATE_QUANTITY,
  payload: {
    id: string,
    priceId: string,
    quantity: number,
  }
}

export function updateQuantityAction(id: string, priceId: string, quantity: number): UpdateQuantity {
  return {
    type: UPDATE_QUANTITY,
    payload: {
      id,
      priceId,
      quantity,
    }
  }
}

interface UpdateItem {
  type: typeof UPDATE_ITEM;
  payload: {
    prevPriceId: string;
    nextPriceId: string;
  }
}

export function updateItemAction(prevPriceId: string, nextPriceId: string): UpdateItem {
  return {
    type: UPDATE_ITEM,
    payload: {
      prevPriceId,
      nextPriceId,
    }
  }
}

interface RemoveItem {
  type: typeof REMOVE_ITEM;
  payload: {
    priceId: string
  }
}

export function removeItemAction(priceId: string): RemoveItem {
  return {
    type: REMOVE_ITEM,
    payload: {
      priceId
    }
  }
}
