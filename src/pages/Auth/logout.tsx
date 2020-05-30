import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { logoutAction, userSelector } from 'domain/env';
import { AppState } from 'domain/StoreType';

const mapDispatch = {
  logout: logoutAction,
}

const mapState = (state: AppState) => ({
  currentUser: userSelector(state),
})

const connector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouteComponentProps {};

function Logout({ logout, currentUser, history }: Props) {

  React.useEffect(() => {
    if (currentUser === null) { history.replace('/login'); } else { logout(); }
  }, [logout, history, currentUser]);

  return null;
}

export default connector(Logout);
