import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import AsyncRoute from 'lib/AsyncRoute'
import { userSelector } from 'domain/env';
import { AppState } from 'domain/StoreType';
import ManagmentItems from './Items';
import './mgm.css';

function asyncCategory(): Promise<unknown> {
  return import('./category').then((res) => {
    return res.default;
  });
}

function asyncUsers(): Promise<unknown> {
  return import('./Users').then((res) => {
    return res.default;
  });
}

function asyncMaintenance(): Promise<unknown> {
  return import('./Maintenance').then((res) => {
    return res.default;
  });
}

function asyncConfig(): Promise<unknown> {
  return import('./Config').then((res) => {
    return res.default;
  });
}

function asyncTMC(): Promise<unknown> {
  return import('./TMC').then((res) => {
    return res.default;
  });
}

function asyncPC(): Promise<unknown> {
  return import('./PC').then((res) => {
    return res.default;
  });
}

const mapStateToProps = (state: AppState) => ({
  user: userSelector(state),
})

type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps);

interface Props extends PropsFromRedux {}

function ManagerRout() {
  return (
    <Switch>
      <Route path="/manager" component={ManagmentItems} exact />
      <AsyncRoute path={["/manager/category/:category", "/manager/category"]} importRender={asyncCategory} />
      <AsyncRoute path="/manager/users" importRender={asyncUsers} />
      <AsyncRoute path="/manager/maintenance" importRender={asyncMaintenance} />
      <AsyncRoute path="/manager/config" importRender={asyncConfig} />
      <AsyncRoute path="/manager/tmc" importRender={asyncTMC} />
      <AsyncRoute path="/manager/pc" importRender={asyncPC} />
    </Switch>
  );
}



export default connector(ManagerRout);