import firebase from 'firebase/app';
import 'firebase/database';
import { AnyAction, MiddlewareAPI, Action } from 'redux';
import omit from 'lodash/fp/omit';
import { AppState, ThunkAction } from 'domain/StoreType';
import * as OrderSelector from 'domain/orders/selectors';
import * as OrderAction from 'domain/orders/actions';
import * as DictionaryAction from 'domain/dictionary/actions';
import * as ReportsAction from 'domain/reports/actions';
import * as DailyAction from 'domain/daily/actions';
import * as Env from 'domain/env/actions';
import * as TR from 'domain/transaction';
import * as handler from './helpers';
import { format } from "date-fns";
import { FORMAT } from "lib/dateHelper";

type AppAction = OrderAction.Action
  | DictionaryAction.Action
  | ReportsAction.Action
  | Env.Action
  | DailyAction.Action
  | TR.Action;

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
    database.ref().child('expenses').on('child_added', handler.expensesHandler);
    database.ref().child('expenses').on('child_changed', handler.expensesHandler);
    database.ref().child('services').on('child_added', handler.servicesHandler);
    database.ref().child('services').on('child_changed', handler.servicesHandler);
    database.ref().child('account').on('child_added', handler.accountHandler);
    database.ref().child('account').on('child_changed', handler.accountHandler);
    database.ref().child(TR.TRANSACTION_LOG).on('child_added', handler.transactionHandler);
    database.ref().child(TR.TRANSACTION_LOG).on('child_changed', handler.transactionHandler);
    // database.ref().child('daily').on('child_added', handler.dailyHandler);
    // database.ref().child('daily').on('child_changed', handler.dailyHandler);

    return (next: Dispatch<AppAction>) => (action: AppAction) => {
      switch (action.type) {

        case OrderAction.COMPLETE:
          const params = { match: { params: { orderId: action.payload.id } }};
          const state = getState();
          const items = OrderSelector.orderArchiveSelector(state, params)
          const discounts = OrderSelector.discountsListSelector(state);
          database.ref('orders/' + action.payload.id).set({
            ...action.payload,
            items,
            discounts,
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
            expiry: action.payload.expiry ? action.payload.expiry.toISOString() : null,
          });
          break;

        case DictionaryAction.CREATE_CATEGORY:
          database.ref('category/' + action.payload.id).set(
            omit('count')(action.payload),
          );
          break;

        case DictionaryAction.UPDATE_CATEGORY:
          database.ref('category/' + action.payload.id).set(
            omit('count')(action.payload),
          );
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
          DictionaryAction.CRUD.effect('expenses', action, data => {
            database.ref('expenses/' + data.id).set({
              ...data,
              date: data.date.toISOString(),
            });
          });
          DictionaryAction.CRUD.effect('services', action, data => {
            database.ref('services/' + data.id).set(data);
          });
          DictionaryAction.CRUD.effect('account', action, data => {
            database.ref('account/' + data.id).set(data);
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
          DictionaryAction.CRUD.effect('expenses', action, data => {
            database.ref('expenses/' + data.id).set({
              ...data,
              date: data.date.toISOString(),
            });
          });
          DictionaryAction.CRUD.effect('services', action, data => {
            database.ref('services/' + data.id).set(data);
          });
          DictionaryAction.CRUD.effect('account', action, data => {
            database.ref('account/' + data.id).set(data);
          });
          break;

        case ReportsAction.GET_ORDERS_REQUEST:
          orders
            .startAt(action.payload.from)
            .endAt(action.payload.to)
            .once('value')
            .then(snapshot => {
              // snapshot.child('orders')
              dispatch(ReportsAction.getOrdersSuccessAction(snapshot.val()));
            });
          break;

        case ReportsAction.GET_DAILY:
          orders
            .startAt(action.payload.from)
            .endAt(action.payload.to)
            .on('child_added', (snapshot) => dispatch(
              ReportsAction.addOrderItemAction(snapshot.val()))
            );
          break;

        case ReportsAction.COMPLETE:
          orders.off('child_added');
          break;

        case Env.CLOSE_SESSION:
          database
            .ref(`session/${format(action.payload.start, FORMAT)}/${action.payload.id}`)
            .set({
              ...action.payload,
              start: action.payload.start.toISOString(),
              end: action.payload.end.toISOString(),
            })
          break;

        case TR.ADD_TRANSACTION:
          database.ref(TR.TRANSACTION_LOG +'/' + action.payload.id).set(action.payload);
          break;

        // case DailyAction.SET_DAY_PARAMS:
        //   database
        //     .ref('daily/' + action.payload.dateKey)
        //     .set({
        //       ...action.payload,
        //       date: action.payload.date.toISOString(),
        //     });
        //   break
        // TODO: Deprecate method

        default:
          break;
      }
      return next(action);
    }
  }
  return (next: Dispatch<AppAction>) => (action: AppAction) => next(action);
}
