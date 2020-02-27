import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: "https://dc6380f693eb40398708c4e33628f825@sentry.io/2413900",
  environment: process.env.REACT_APP_ENV,
});
