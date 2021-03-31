import * as Sentry from '@sentry/browser';

const ENV = process.env.NODE_ENV;
if (ENV !== 'development') {
  Sentry.init({
    dsn: "https://dc6380f693eb40398708c4e33628f825@sentry.io/2413900",
    environment: ENV,
  });
}

export enum EEventsTag {
  IDB = 'INDEXED_DB',
}

export function enrichMessage(message: string, meta?: any, tag?: EEventsTag) {
  Sentry.withScope(scope => {
    if (typeof tag === 'string') {
      scope.setTag('source', tag);
    }
    if (meta) {
      scope.setExtra('data', JSON.stringify(meta, null, 2));
    }
    Sentry.captureMessage(message);
  });
}

export function enrichException(error: Error, meta?: any, tag?: EEventsTag) {
  Sentry.withScope(scope => {
    if (typeof tag === 'string') {
      scope.setTag('source', tag);
    }
    if (meta) {
      scope.setExtra('data', JSON.stringify(meta, null, 2));
    }
    Sentry.captureException(error);
  });
}
