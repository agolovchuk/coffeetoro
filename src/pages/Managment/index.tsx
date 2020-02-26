import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import AsyncRoute from 'lib/AsyncRoute'
import { userSelector } from 'domain/env';
import { AppState } from 'domain/StoreType';

function asyncCategory(): Promise<unknown> {
  return import('./category').then((res) => {
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
    <React.Fragment>
      <AsyncRoute path="/manager" importRender={asyncCategory} />
    </React.Fragment>
  );
}



export default connector(ManagerRout);