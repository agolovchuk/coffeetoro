import * as Sentry from '@sentry/browser';

const ENV = process.env.NODE_ENV;
if (ENV !== 'development') {
  Sentry.init({
    dsn: "https://dc6380f693eb40398708c4e33628f825@sentry.io/2413900",
    environment: ENV,
  });
}
