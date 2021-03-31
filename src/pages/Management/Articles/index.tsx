import * as React from "react";
import { Route } from 'react-router-dom';
import { CategoryManager, EGroupName } from "../../../modules/category";
import TMCList from './list';
import { CategoryItem } from "../../../domain/dictionary";

function Articles({ match }: any) {

  const path = React.useMemo(() => ["/manager/articles/:category", "/manager/articles"], []);

  const createLink = React.useCallback(
    ({ id }: CategoryItem) => ['/manager', 'articles', id].join('/'),
    [],
  );

  return (
    <CategoryManager
      category={match.params.category}
      groupName={EGroupName.ARTICLES}
      createLink={createLink}
    >
      <Route path={path} component={TMCList} />
    </CategoryManager>
  )
}

export default React.memo(Articles);
