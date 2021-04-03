import { useState, useCallback } from 'react';
import get from 'lodash/get';
import { CountedCategoryItem } from 'domain/dictionary';
import { getId } from 'lib/id';
import { MItem, Header } from '../../manage';
import { getMax } from '../../../pages/Management/helper';
import { EitherCategory, IUseItem, EGroupName } from '../Types';
import styles from './item.module.css';

function createItemFactory(
  group: string = EGroupName.PRICES,
  sortIndex: number = 0,
  parentId: string = 'root',
): CountedCategoryItem {
  return {
    id: getId(10),
    name: '',
    title: '',
    sortIndex,
    parentId,
    count: 0,
    group,
  }
}

function useItem({ groupName, category, categoryByName, categories, createLink, update, create }: IUseItem) {

  const [item, setItem] = useState<EitherCategory | null>(null);

  const clearItem = useCallback(
    () => setItem(null),
    [setItem]
  );

  const onEdit = useCallback(
    ({ isEdit, ...value }: EitherCategory) => {
      if (isEdit) {
        update(value)
      } else {
        create(value);
      }
      clearItem();
    },
    [update, create, clearItem],
  );

  const handleEdit = useCallback(
    (value: CountedCategoryItem) => setItem({ ...value, isEdit: true }),
    [],
  );

  const title = useCallback(
    (data: CountedCategoryItem) => <div className={styles.title}>{data.title}</div>,
    [],
  );

  const createCategory = useCallback(
    () => {
      const categoryId = category ? get(categoryByName, [category, 'id']) : undefined;
      const cat = createItemFactory(groupName, getMax(categories) + 1, categoryId);
      setItem(cat);
    },
    [category, categories, categoryByName, groupName],
  );

  const rowItem = useCallback(
    (data: CountedCategoryItem) => data ? (
      <MItem
        data={data}
        title={title(data)}
        getLink={createLink(data)}
        onEdit={handleEdit}
      />
    ) : (
      <Header
        title="Категории"
        onCreate={createCategory}
      />
    ),
    [createLink, handleEdit, createCategory, title],
  );

  return {
    item,
    setItem,
    row: rowItem,
    clearItem,
    onEdit,
  }

}

export default useItem;
