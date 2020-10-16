import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createUserAction, updateUserAction, getUsersAction, usersListSelector, User } from 'domain/users';
import { AppState } from 'domain/StoreType';
import { Field } from 'react-final-form';
import {CheckBoxField, InputField, SelectField} from 'components/Form/field';
import { Main } from '../components';
import { EitherEdit } from '../Types';

type UserType = User;

const ROLES = [
  { name: 'user', title: 'Regular user'},
  { name: 'manager', title: 'Manager'},
];

function createItem(): UserType {
  return {
    id: '',
    name: '',
    role: 'user',
    firstName: '',
    lastName: '',
    ava: '',
    lang: 'en',
    hash: '',
    active: true,
  }
}

const mapStateToProps = (state: AppState) => ({
  users: usersListSelector(state),
});

const mapDispatch = {
  createUser: createUserAction,
  updateUser: updateUserAction,
  getUsers: getUsersAction,
}

type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatch);

interface Props extends PropsFromRedux {};

function orderUsers(a: UserType, b: UserType): number {
  return a.name.localeCompare(b.name);
}

function ManagementUsers({ createUser, getUsers, updateUser, ...props }: Props) {

  React.useEffect(() => { getUsers(); }, [getUsers]);

  const handleCreateUser = React.useCallback(
    async ({ isEdit, ...newUser}: EitherEdit<UserType>, cb: () => void) => {
    if (isEdit) {
      await updateUser(newUser, cb);
    } else {
      await createUser(newUser, cb);
    }
  }, [createUser, updateUser]);

  const createLink = React.useMemo(() => {
    return (data: UserType) => ['/manager', 'users', data.id].join('/');
  }, []);

  const editAdapter = React.useCallback((value: UserType) => ({
    ...value,
    active: typeof value.active === 'undefined' ? true : value.active,
    isEdit: true,
  }), []);

  return (
    <Main
      title="Users"
      list={props.users}
      createItem={createItem}
      handleSubmit={handleCreateUser}
      popupTitle="Create user"
      createLink={createLink}
      editAdapter={editAdapter}
      createTitle={({ name }) => name}
      orderBy={orderUsers}
    >
      <Field name="active" type="checkbox" render={({ input}) => (
        <CheckBoxField id="active" title="Active:" {...input} />
      )} />
      <Field name="role" render={({input}) => (
        <SelectField
          list={ROLES}
          id="role"
          title="Role:"
          {...input}
        />
      )}/>
      <Field name="name" render={({input}) => (
        <InputField id="name" title="Name:" {...input} />
      )}/>
    </Main>
  );
}

export default connector(ManagementUsers);
