import * as CRUD from './crud';

export { CRUD }

export type Action = ReturnType<typeof CRUD.createItemAction>
  | ReturnType<typeof CRUD.getAllAction>
  | ReturnType<typeof CRUD.getAllActionSuccess>
  | ReturnType<typeof CRUD.updateItemAction>
  ;