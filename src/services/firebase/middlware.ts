import firebase from 'firebase/app';
import 'firebase/database';
import { Dispatch, MiddlewareAPI } from 'redux';
import { AppState } from 'domain/StoreType';
import * as OrderSekectot from 'domain/orders/selectors';
import * as OrderAction from 'domain/orders/actions';
import * as DictionaryAction from 'domain/dictionary/actions';
import * as handler from './helpers';

type Action = OrderAction.Action | DictionaryAction.Action;

export default function fbMiddlware({ getState }: MiddlewareAPI<Dispatch, AppState>) {
  const config = getState().env.firebaseConfig;
  if (config && config.apiKey) {
    const app = firebase.initializeApp(config);
    const database: firebase.database.Database = app.database();

    database.ref().child('price').on('child_added', handler.addPriceHandler);
    database.ref().child('price').on('child_changed', handler.changePriceHandler);
    database.ref().child('category').on('child_added', handler.addCategoryHandler);
    database.ref().child('category').on('child_changed', handler.changeCategoryHandler);
    database.ref().child('tmc').on('child_added', handler.addTMCHandler);
    database.ref().child('tmc').on('child_changed', handler.changeTMCHandler);
    database.ref().child('processCards').on('child_added', handler.addPCHandler);
    database.ref().child('processCards').on('child_changed', handler.changePCHandler);

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
            add: action.payload.add.toISOString(),
          });
          break;

        case DictionaryAction.UPDATE_PRICE:
          database.ref('price/' + action.payload.id).set({
            ...action.payload,
            add: action.payload.add.toISOString(),
          });
          break;

        case DictionaryAction.CREATE_CATEGORY:
          database.ref('category/' + action.payload.id).set(action.payload);
          break;

        case DictionaryAction.UPDATE_CATEGORY:
          database.ref('category/' + action.payload.id).set(action.payload);
          break;

        case DictionaryAction.CRUD.createItemAction.type:
          DictionaryAction.CRUD.effect('tmc', action, data => {
            database.ref('tmc/' + data.id).set(data);
          });
          DictionaryAction.CRUD.effect('processCards', action, data => {
            database.ref('processCards/' + data.id).set(data);
          });
          break;

        case DictionaryAction.CRUD.updateItemAction.type:
          DictionaryAction.CRUD.effect('tmc', action, data => {
            database.ref('tmc/' + data.id).set(data);
          });
          DictionaryAction.CRUD.effect('processCards', action, data => {
            database.ref('processCards/' + data.id).set(data);
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
