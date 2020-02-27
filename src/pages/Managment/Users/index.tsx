import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { userSelector } from 'domain/env';
import { AppState } from 'domain/StoreType';

const mapStateToProps = (state: AppState) => ({
  user: userSelector(state),
})

type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps);

interface Props extends PropsFromRedux {}

function ManagmentUsers({ }: Props) {
  return (
    <section>
      <h1>Users</h1>
    </section>
  )
}

export default connector(ManagmentUsers);