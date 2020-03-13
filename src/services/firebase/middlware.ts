import firebase from 'firebase/app';
import 'firebase/database';
import { Dispatch, MiddlewareAPI } from 'redux';
import { AppState } from 'domain/StoreType';
import * as OrderSekectot from 'domain/orders/selectors';
import * as OrderAction from 'domain/orders/actions';
import * as DictionaryAction from 'domain/dictionary/actions';

type Action = OrderAction.Action | DictionaryAction.Action;

export default function fbMiddlware({ dispatch, getState }: MiddlewareAPI<Dispatch<Action>, AppState>) {
  const config = getState().env.firebaseConfig;
  if (config && config.apiKey) {
    const app = firebase.initializeApp(config);
    const database: firebase.database.Database = app.database();
    return (next: Dispatch<Action>) => (action: Action) => {
      switch (action.type) {

        case OrderAction.COMPLETE:
          const params = { match: { params: { orderId: action.payload.id } }};
          const items = OrderSekectot.orderArchiveSelector(getState(), params )
          database.ref('orders/' + action.payload.id).set({
            ...action.payload,
            items,
            date: action.payload.date.toISOString(),
          });
          break;

        case DictionaryAction.CREATE_PRICE:
          database.ref('price/' + action.payload.id).set({
            ...action.payload,
            fromDate: action.payload.fromDate.toISOString(),
          });
          break;

        default:
          break;
      }
      return next(action);
    }
  }
  return (next: Dispatch<Action>) => (action: Action) => next(action);
}
