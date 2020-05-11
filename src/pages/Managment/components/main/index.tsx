import * as React from "react";
import {Header, ItemList, ManagmentPopup, MItem} from "../index";
import { EitherEdit } from "../../Types";

interface Props<T> {
  children: React.ReactNode;
  title: string;
  list: ReadonlyArray<T>;
  createItem: () => T;
  editAdapter: (data: T) => EitherEdit<T>;
  handleSubmit: (data: T, cb: () => void) => void;
  popupTitle: string;
  createLink: (data: T) => string;
  createTitle: (data: T) => string;
}

interface DataType {
  id: string
}

function PageFactory<T extends DataType>({ createTitle, createItem, editAdapter, handleSubmit, ...props }: Props<T>) {

  const [item, setItem] = React.useState<EitherEdit<T> | null>(null);

  const handleCreat = React.useCallback(() => {
    setItem(createItem());
  }, [createItem]);

  const handleEdit = React.useCallback((value: T) => {
    setItem(editAdapter(value));
  }, [editAdapter]);

  const onSubmit = React.useCallback((value: EitherEdit<T>) => {
    handleSubmit({ ...createItem(), ...value }, () => setItem(null));
  }, [handleSubmit, createItem]);

  return (
    <section className="scroll-section">
      <Header title={props.title} onCreate={handleCreat} />
      <ItemList list={props.list} getKey={e => e.id}>
        {
          (data) => (
            <MItem
              data={data}
              title={createTitle(data)}
              getLink={props.createLink}
              onEdit={handleEdit}
            />
          )
        }
      </ItemList>
      {
        item && (
          <ManagmentPopup
            title={props.popupTitle}
            onCancel={() => setItem(null)}
            initialValues={item}
            onSubmit={onSubmit}
          >
            {
              props.children
            }
          </ManagmentPopup>
        )
      }
    </section>
  );
}

export default PageFactory;
