import * as React from "react";
import { ValidationErrors } from 'final-form';
import { Header, ItemList, ManagementPopup } from "../index";
import { EitherEdit } from "../../Types";

interface Props<T> {
  children: React.ReactNode;
  title: string;
  list: ReadonlyArray<T>;
  createItem: () => T;
  editAdapter: (data: T) => EitherEdit<T>;
  handleSubmit: (data: T, cb: () => void) => void;
  popupTitle: string;
  createLink: (d: { data: T, handleEdit(data: T): void }) => string | JSX.Element;
  orderBy?: (a: T, b: T) => number;
  header?: React.ReactNode;
  validate?: (d: T) => (ValidationErrors | Promise<ValidationErrors>);
}

interface DataType {
  id: string
}

function PageFactory<T extends DataType>({
  createItem,
  editAdapter,
  handleSubmit,
  createLink,
  ...props
}: Props<T>) {

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
  }, [handleSubmit, createItem, setItem]);

  React.useEffect(() => {
    status.current = true;
    return () => {
      status.current = false;
    }
  }, []);

  const createListItem = React.useCallback((data) => createLink({ data, handleEdit }), [createLink, handleEdit]);

  return (
    <section className="scroll-section">
      <Header title={props.title} onCreate={handleCreat} isSticky>
        {
          props.header
        }
      </Header>
      <ItemList list={props.list} getKey={e => e.id} orderBy={props.orderBy}>
        {createListItem}
      </ItemList>
      {
        item && (
          <ManagementPopup
            title={props.popupTitle}
            onCancel={() => setItem(null)}
            initialValues={item}
            onSubmit={onSubmit}
            validate={props.validate}
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
