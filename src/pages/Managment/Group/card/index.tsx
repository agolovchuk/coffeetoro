import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays';
import cx from 'classnames'
import { InputField } from 'components/Form/field';
import {
  getGroupArticlesAction,
  groupArticlesSelector,
  CRUD,
  TMCItem,
  GroupArticles,
  putArticlesAction,
} from 'domain/dictionary';
import { AppState } from 'domain/StoreType';
import Header from '../../components/header';
import { getTitle } from '../../helper';
import Add from '../../PC/card/add';
import styles from './card.module.css';

interface SubmitValue extends Omit<GroupArticles, 'group'> {
  group: ReadonlyArray<TMCItem>
}

type RouterProps = {
  match: match<{ groupId: string }>
}

const mapStateToProps = (state: AppState, props: RouterProps) => ({
  card: groupArticlesSelector(state, props),
});

const mapDispatch = {
  getGroup: getGroupArticlesAction,
  update: CRUD.updateItemAction,
  putArticles: putArticlesAction,
}

const connector = connect(mapStateToProps, mapDispatch);

interface Props extends ConnectedProps<typeof connector>, RouterProps {}

function Item({ card, getGroup, match, update, putArticles }: Props) {
  const { params: { groupId } } = match;

  const onSubmit = React.useCallback(({ group, ...value }: SubmitValue) => {
    const a = group.map(({ id }) => id);
    putArticles(group);
    update('groupArticles', { ...value, group: a });
  }, [update, putArticles]);

  React.useEffect(() => { getGroup(groupId); }, [groupId, getGroup]);

  const initialValues = React.useMemo(() => card, [card]);

  return card ? (
    <section className={cx('scroll-section', styles.container)}>
      <Header title={card.title} />
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        mutators={{ ...arrayMutators }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field name="description" render={({ input }) => (
              <InputField id="description" title="Description:" {...input} />
            )}/>
            <FieldArray name="group" >
              {
                ({ fields }) => (
                  <ul className={styles.list}>
                    {
                      fields.map((name, index) => (
                        <li key={name} className={styles.item}>
                          <Field name={`${name}`} render={({ input }) => (
                            <div className={styles.article}>{getTitle(input.value)}</div>
                          )}/>
                          <button
                            className={cx("btn__remove", styles.remove)}
                            onClick={() => fields.remove(index)}
                          />
                        </li>
                      ))
                    }
                    <Add onAdd={(data) => fields.push(data)} />
                  </ul>
                )
              }
            </FieldArray>
            <div className={styles.btnGroup}>
              <button
                type="submit"
                className={cx("btn__positive", styles.submit)}
              >Save</button>
            </div>
          </form>
        )}
      />
    </section>
  ) : null;
}

export default connector(Item);
