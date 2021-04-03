import { memo } from 'react';
import { Route, Switch } from 'react-router-dom';
import AsyncRoute from 'lib/AsyncRoute'
import ManagementItems from './Items';

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
  return import('./Articles').then((res) => {
    return res.default;
  });
}

function asyncPC(): Promise<unknown> {
  return import('./PC').then((res) => {
    return res.default;
  });
}

// function asyncGroupArticles(): Promise<unknown> {
//   return import('./Group').then((res) => {
//     return res.default;
//   });
// }

function asyncReports(): Promise<unknown> {
  return import('./Reports').then((res) => {
    return res.default;
  });
}

function asyncExpense(): Promise<unknown> {
  return import('./Expense').then((res) => {
    return res.default;
  });
}

// function asyncTrialBalance(): Promise<unknown> {
//   return import('./TrialBalance').then((res) => {
//     return res.default;
//   });
// }

function asyncServices(): Promise<unknown> {
  return import('./Services').then((res) => {
    return res.default;
  });
}

function asyncAccount(): Promise<unknown> {
  return import('./Accounts').then((res) => {
    return res.default;
  });
}

function ManagerRout() {
  return (
    <Switch>
      <Route path="/manager" component={ManagementItems} exact />
      <AsyncRoute path={["/manager/category/:category", "/manager/category"]} importRender={asyncCategory} />
      <AsyncRoute path="/manager/users" importRender={asyncUsers} />
      <AsyncRoute path="/manager/maintenance" importRender={asyncMaintenance} />
      <AsyncRoute path="/manager/config" importRender={asyncConfig} />
      <AsyncRoute path={["/manager/articles", "/manager/articles/:category"]} importRender={asyncTMC} />
      <AsyncRoute path="/manager/pc" importRender={asyncPC} />
      {/* <AsyncRoute path="/manager/group" importRender={asyncGroupArticles} /> */}
      <AsyncRoute path="/manager/reports" importRender={asyncReports} />
      <AsyncRoute path="/manager/expense" importRender={asyncExpense} />
      <AsyncRoute path="/manager/services" importRender={asyncServices} />
      <AsyncRoute path="/manager/accounts" importRender={asyncAccount} />
      {/* <AsyncRoute path="/manager/trial-balance" importRender={asyncTrialBalance} /> */}
    </Switch>
  );
}

export default memo(ManagerRout);
