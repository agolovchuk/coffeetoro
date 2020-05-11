import * as React from "react";

export interface ISelectItem {
  name: string;
  title: string;
  disabled?: boolean;
}

export type ISelectList = ReadonlyArray<ISelectItem>;

export interface HTMLInputProps {
  name: string;
  className?: string;
  onBlur?: (event?: React.FocusEvent) => void;
  onChange?: (event: React.ChangeEvent | any) => void;
  onFocus?: (event?: React.FocusEvent) => void;
  type?: 'text' | 'checkbox' | 'number' | 'search';
  value: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  readOnly?: boolean;
}
