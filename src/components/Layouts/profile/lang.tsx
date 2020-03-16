import * as React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import { userSelector, LangType } from 'domain/env';
import { AppState } from 'domain/StoreType';
import * as messages from 'l10n';
import cx from 'classnames';
import styles from './profile.module.css';
import { updateUserAction, User } from 'domain/users';

const mapState = (state: AppState) => ({
  user: userSelector(state)
})

const connector = connect(mapState, { updateUserAction });

const list = Object.keys(messages) as LangType[];

function Lang({ user, updateUserAction }: ConnectedProps<typeof connector>) {
  if (!user) return null;
  const update = ( newLang: LangType ) => {
    if (user.lang !== newLang) {
      const data = { ...user, lang: newLang } as User;
      updateUserAction(data, () => {});
    }
  };
  return (
      <ul className={styles.list}>
        { list.map(v => <button type="button"
            onClick={() => update(v)}
            className={ cx(styles.item, { [styles.active]: v === user.lang })}
        >{ v }</button>)}
      </ul>
  )
}

export default connector(Lang);
