const SET_ACTIVE_ORDER = 'ENV/SET_ACTIVE_ORDER';

interface ISetActiveOrder {
  type: typeof SET_ACTIVE_ORDER;
  payload: string;
}

export function setActiveOrder(id: string): ISetActiveOrder {
  return {
    type: SET_ACTIVE_ORDER,
    payload: id,
  }
}
