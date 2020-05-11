import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { replace as replaceAction } from 'connected-react-router';
import { logoutAction, userSelector } from 'domain/env';
import { AppState } from 'domain/StoreType';

const mapDispatch = {
  logout: logoutAction,
  replace: replaceAction,
}

const mapState = (state: AppState) => ({
  currentUser: userSelector(state),
})

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector> {};

function Logout({ logout, currentUser, replace }: Props) {

  React.useEffect(() => {
    if (currentUser === null) { replace('/login'); } else { logout(); }
  }, [logout, replace, currentUser]);

  return null;
}

export default connector(Logout);