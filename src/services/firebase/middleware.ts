import firebase from 'firebase/app';
import 'firebase/database';
import { AnyAction, MiddlewareAPI, Action } from 'redux';
import { format } from 'date-fns';
import { AppState, ThunkAction } from 'domain/StoreType';
import * as OrderSelector from 'domain/orders/selectors';
import * as OrderAction from 'domain/orders/actions';
import * as DictionaryAction from 'domain/dictionary/actions';
import * as ReportsAction from 'domain/reports/actions';
import * as handler from './helpers';

type AppAction = OrderAction.Action | DictionaryAction.Action | ReportsAction.Action;

type Ak = Action | ThunkAction<AnyAction>;

type An = AnyAction | ThunkAction<AnyAction>;

interface Dispatch<A extends Ak = An> {
  <T extends A>(action: T): T
}

export default function fbMiddleware({ getState, dispatch }: MiddlewareAPI<Dispatch, AppState>) {
  const config = getState().env.firebaseConfig;
  if (config && config.apiKey) {
    const app = firebase.initializeApp(config);
    const database: firebase.database.Database = app.database();

    const orders = database.ref('orders').orderByChild('date');

    database.ref().child('price').on('child_added', handler.priceHandler);
    database.ref().child('price').on('child_changed', handler.priceHandler);
    database.ref().child('category').on('child_added', handler.categoryHandler);
    database.ref().child('category').on('child_changed', handler.categoryHandler);
    database.ref().child('tmc').on('child_added', handler.tmcHandler);
    database.ref().child('tmc').on('child_changed', handler.tmcHandler);
    database.ref().child('processCards').on('child_added', handler.pcHandler);
    database.ref().child('processCards').on('child_changed', handler.pcHandler);
    database.ref().child('groupArticles').on('child_added', handler.groupHandler);
    database.ref().child('groupArticles').on('child_changed', handler.groupHandler);

    return (next: Dispatch<AppAction>) => (action: AppAction) => {
      switch (action.type) {

        case OrderAction.COMPLETE:
          const params = { match: { params: { orderId: action.payload.id } }};
          const items = OrderSelector.orderArchiveSelector(getState(), params )
          database.ref('orders/' + action.payload.id).set({
            ...action.payload,
            items,
            date: action.payload.date.toISOString(),
            d: format(action.payload.date, 'dd'),
            m: format(action.payload.date, 'MM'),
            y: format(action.payload.date, 'yy'),
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
          DictionaryAction.CRUD.effect('groupArticles', action, data => {
            database.ref('groupArticles/' + data.id).set(data);
          });
          break;

        case DictionaryAction.CRUD.updateItemAction.type:
          DictionaryAction.CRUD.effect('tmc', action, data => {
            database.ref('tmc/' + data.id).set(data);
          });
          DictionaryAction.CRUD.effect('processCards', action, data => {
            database.ref('processCards/' + data.id).set(data);
          });
          DictionaryAction.CRUD.effect('groupArticles', action, data => {
            database.ref('groupArticles/' + data.id).set(data);
          });
          break;

        case ReportsAction.GET_DAILY:
          orders.startAt(action.payload).on('child_added', (snapshot) => dispatch(
            ReportsAction.addOrderItemAction(snapshot.val()))
          );
          break;

        case ReportsAction.COMPLETE:
          orders.equalTo(action.payload).off('child_added');
          break;

        default:
          break;
      }
      return next(action);
    }
  }
  return (next: Dispatch<AppAction>) => (action: AppAction) => next(action);
}
