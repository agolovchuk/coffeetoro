import {IntlProvider} from "react-intl";
import React from "react";
import {connect, ConnectedProps} from 'react-redux';
import { langSelector, LangType } from 'domain/env';
import { AppState } from 'domain/StoreType';
import * as messages from 'l10n';

const mapState = (state: AppState) => ({
  lang: langSelector(state)
})

const connector = connect(mapState);

interface Props extends ConnectedProps<typeof connector> {
  locale: string,
  children: React.ReactNode;
}

const getMessages = (lang: LangType): Record<string, string> => messages[lang] || {};

function ConnectedIntlProvider({ lang, locale, ...props }: Props) {
  const m = getMessages(lang);
  return <IntlProvider
      locale={locale}
      messages={m}
      {...props}
  />
}



export default connector(ConnectedIntlProvider);
