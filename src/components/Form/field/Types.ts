export interface ISelectItem {
  name: string;
  title: string;
  disabled?: boolean;
}

export type ISelectList = ReadonlyArray<ISelectItem>;