import {useCallback, useMemo} from 'react';
import { useDispatch } from 'react-redux';
import { CRUD } from 'domain/dictionary';
import { EitherEdit, IUseRecords, TEditAdapter } from "./Types";
import * as React from "react";

export function useRecords<T>({ update, create, name }: IUseRecords<T>) {

  const dispatch = useDispatch();

  const editAdapter = React.useCallback<TEditAdapter<T>>(
    (value: T) => ({ ...value, isEdit: true }),
    [],
  );

  const da = useCallback((fn) => (valus: T) => dispatch(fn(name, valus)), [dispatch, name]);

  const updateAction = useMemo(
    () => typeof update === 'function' ? update : da(CRUD.updateItemAction),
    [update, da],
  );

  const createAction = useMemo(
    () => typeof create === 'function' ? create : da(CRUD.createItemAction),
    [create, da],
  )

  const manage = useCallback(
    ({ isEdit, ...data }: EitherEdit<T>, cb: () => void) => {
      if (isEdit === true) { updateAction((data as T)); }
      else { createAction((data as T)); }
      cb();
    },
    [updateAction, createAction],
  );

  return {
    manage,
    editAdapter,
  }
}
