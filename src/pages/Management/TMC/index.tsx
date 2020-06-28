import * as React from "react";
import { Route } from 'react-router-dom';
import CategoryManager from "../components/category";
import TMCList from './list';
import {CategoryItem} from "../../../domain/dictionary";

function Articles({ match }: any) {

  const createLink = React.useCallback(
    ({ id }: CategoryItem) => ['/manager', 'articles', id].join('/'),[]);

  return (
    <CategoryManager
      category={match.params.category}
      groupName="articles"
      createLink={createLink}
    >
      <Route path={["/manager/articles/:category", "/manager/articles"]} component={TMCList} />
    </CategoryManager>
  )
}

export default React.memo(Articles);
