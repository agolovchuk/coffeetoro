import { Dispatch, MiddlewareAPI } from 'redux';
import CDB from './index';
import * as OrderAction from 'domain/orders/actions';
import * as DictionaryAction from 'domain/dictionary/actions';
import * as adapters from './adapters';
import { validateArray } from 'lib/contracts';

type Action = OrderAction.Action | DictionaryAction.Action;

export default function idMiddleware() {
  const Idb = new CDB();
  return ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    switch (action.type) {

      case DictionaryAction.CRUD.getAllAction.type:
        const { name, index, query } = action.payload;
        const validator = adapters.dictionaryAdapters[name];
        Idb.getAll(name, validateArray(validator), index, query).then(res => {
          if (res) dispatch(DictionaryAction.CRUD.getAllActionSuccess(name, res))
        });
        break;

      case DictionaryAction.CRUD.createItemAction.type:
        Idb.addItem(action.payload.name, action.payload.data);
        break;

      case DictionaryAction.CRUD.updateItemAction.type:
        Idb.updateItem(action.payload.name, action.payload.data);
        break;

      default:
        break;
    }
    return next(action);
  }
}
