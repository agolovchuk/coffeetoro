import {IntlProvider} from "react-intl";
import React from "react";
import {connect, ConnectedProps} from 'react-redux';
import { langSelector } from 'domain/env';
import { AppState } from 'domain/StoreType';
import { getMessages, Messages } from 'l10n';

const mapState = (state: AppState) => ({
  lang: langSelector(state)
})

const connector = connect(mapState);

interface Props extends ConnectedProps<typeof connector> {
  locale: string;
  children: React.ReactNode;
  defaultMessage: Messages;
}

function ConnectedIntlProvider({ lang, defaultMessage, locale, ...props }: Props) {
  const [messages, setMessage] = React.useState<Messages>(defaultMessage);

  React.useEffect(() => {
    let isMounted = true;
    getMessages(lang)?.then((m) => { if (isMounted) setMessage(m); });
    return () => { isMounted = false; }
  }, [lang]);

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      {...props}
    />
  )
}



export default connector(ConnectedIntlProvider);
