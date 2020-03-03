import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createUserAction, getUsersAction, usersListSelector, User } from 'domain/users';
import { AppState } from 'domain/StoreType';
import { Field } from 'react-final-form';
import { InputField, SelectField } from 'components/Form/field';
import ItemList from '../components/list';
import MItem from '../components/item';
import Header from '../components/header';
import ManagmentPopup from '../components/popup';
import { EitherEdit } from '../Types';
import { Route } from 'react-router-dom';
import OneUser from './user';
import styles from './user.module.css';

type UserType = Partial<User>;

const ROLES = [
  { name: 'user', title: 'Regular user'},
  { name: 'manager', title: 'Manager'},
];

function createItem(): UserType {
  return {
    name: '',
    role: 'user',
  }
}

const mapStateToProps = (state: AppState) => ({
  users: usersListSelector(state),
});

const mapDispatch = {
  createUser: createUserAction,
  getUsers: getUsersAction,
}

type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatch);

interface Props extends PropsFromRedux {}

function ManagmentUsers({ createUser, getUsers, users }: Props) {

  const [user, setUser] = React.useState<null | EitherEdit<UserType>>(null);

  React.useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleOpen = React.useCallback(() => {
    setUser(createItem());
  }, []);

  return (
    <div className={styles.container}>
      <section>
        <Header title="Users" onCreate={handleOpen} />
        <ItemList list={users} getKey={c => c.id}>
          {
            data => (
              <MItem
                data={data}
                title={data.name}
                onEdit={() => setUser({ ...data, isEdit: true })}
                getLink={({ name }) => ['/manager/users', name].join('/')}
              />
            )
          }
        </ItemList>
      </section>
      <Route path={'/manager/users/:user'} component={OneUser} exact />
      {
        user && (
          <ManagmentPopup
            title="Create user"
            onCancel={() => setUser(null)}
            initialValues={user}
            onSubmit={(value) => createUser(value)}
          >
            <Field name="role" render={({ input, meta }) => (
              <SelectField
                list={ROLES}
                id="role"
                title="Role:"
                {...input}
              />
            )}/>
            <Field name="name" render={({ input, meta }) => (
              <InputField id="name" title="Name:" {...input} />
            )}/>
          </ManagmentPopup>
        )
      }
    </div>
  );
}

export default connector(ManagmentUsers);