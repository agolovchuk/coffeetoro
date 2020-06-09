import * as React from "react";
import {Header, ItemList, ManagementPopup, MItem} from "../index";
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
  createTitle: (data: T) => string | React.ReactNode;
  orderBy?: (a: T, b: T) => number;
}

interface DataType {
  id: string
}

function PageFactory<T extends DataType>({ createTitle, createItem, editAdapter, handleSubmit, ...props }: Props<T>) {

  const [item, setItem] = React.useState<EitherEdit<T> | null>(null);

  const status = React.useRef<boolean>(false);

  const handleCreat = React.useCallback(() => {
    setItem(createItem());
  }, [createItem]);

  const handleEdit = React.useCallback((value: T) => {
    setItem(editAdapter(value));
  }, [editAdapter]);

  const onSubmit = React.useCallback((value: EitherEdit<T>) => {
    handleSubmit({ ...createItem(), ...value }, () => {
      status.current && setItem(null);
    });
  }, [handleSubmit, createItem]);

  React.useEffect(() => {
    status.current = true;
    return () => {
      status.current = false;
    }
  }, []);

  return (
    <section className="scroll-section">
      <Header title={props.title} onCreate={handleCreat} isSticky />
      <ItemList list={props.list} getKey={e => e.id} orderBy={props.orderBy}>
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
          <ManagementPopup
            title={props.popupTitle}
            onCancel={() => setItem(null)}
            initialValues={item}
            onSubmit={onSubmit}
          >
            {
              props.children
            }
          </ManagementPopup>
        )
      }
    </section>
  );
}

export default PageFactory;
