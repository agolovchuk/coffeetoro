export interface ActionAdapter<P extends object> {
  (...args: ReadonlyArray<any>): P;
}

function defaultAdapter<P extends object>(payload: string): P {
  return {
    payload,
  } as P;
}

export function asyncAction<T, P extends object>(type: T, adapter: ActionAdapter<P> = defaultAdapter) {
  const ac = (...args: ReadonlyArray<any>) => ({ type, ...adapter(args) });
  ac.type = type;
  return ac;
}
