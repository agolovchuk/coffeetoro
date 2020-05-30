import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { AppState } from 'domain/StoreType';
import { userSelector, IUser } from 'domain/env';
import Layout from 'components/Layouts';
import OrdersList from './OrdersList';
import CacheBox from './CashBox';
import Auth from './Auth';
import Logout from './Auth/logout';
import ManagerRout from 'pages/Managment';
import PNF from './404';
import UserPage from './User';

const mapState = (state: AppState) => ({
  user: userSelector(state),
});

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>;

function getAvailablePath(user: IUser | null): string[] {
  const usersPath = ['/orders', '/order', '/user'];
  const managerPath = ['/manager'];
  if (user === null) return [];
  if (user.role === 'manager') return usersPath.concat(managerPath);
  return usersPath;
}

function App({ user }: Props) {
  const path = React.useMemo(() => getAvailablePath(user), [user]);
  return (
    <Switch>
      <Route path="/login" exact component={Auth} />
      <Route path="/logout" exact component={Logout} />
      <Route path={path} render={({ location, history }) => (
        <Layout onBack={history.goBack} location={location} user={user}>
          <Switch>
            <Route path="/user" component={UserPage} exact />
            <Route path="/orders" component={OrdersList} exact />
            <Route path="/order/:orderId" component={CacheBox} />
            <ManagerRout />
          </Switch>
        </Layout>
      )}>
      </Route>
      {
        user !== null ? (
          <Redirect from="/" to="/orders" exact />
        ) : (
          <Redirect from="/" to="/login" exact />
        )
      }
      <Route path="*" component={PNF} />
    </Switch>
  );
}

export default connector(App)
