import { CountedCategoryItem, EGroupName } from 'domain/dictionary';
import { EitherEdit } from '../../pages/Management/Types';

// export enum EGroupName {
//   ARTICLES = 'articles',
//   PRICES = 'prices',
// }

export type EitherCategory = EitherEdit<CountedCategoryItem>;

export interface IUseItem {
  category?: string;
  groupName: EGroupName;
  categoryByName: Record<string, CountedCategoryItem>;
  categories: ReadonlyArray<CountedCategoryItem>;
  createLink(d: CountedCategoryItem): string;
  create(d: CountedCategoryItem): void;
  update(d: CountedCategoryItem): void;
}
