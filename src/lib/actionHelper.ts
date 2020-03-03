type ParamsType = Record<string, any>;

interface Promisifyed {
  resolve: () => void;
  reject: () => void;
}

export function promisifyAction<T extends ParamsType & Promisifyed>(fn: (p: T) => void, params: T): Promise<void> {
  return new Promise((resolve, reject) => {
    fn({ ...params, resolve, reject });
  });
}