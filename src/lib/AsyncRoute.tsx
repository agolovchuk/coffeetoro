import * as React from 'react';
import { Route, RouteProps } from 'react-router-dom';

type Props = RouteProps & {
  importRender: () => Promise<unknown>;
}

function AsyncRoute({ importRender, render, ...props }: Props) {

  const [Component, setComponent] = React.useState<null | React.ComponentType<any>>(null);

  React.useEffect(() => {
    let isMount = true;
    importRender()
      .then((Component) => {
        if(isMount) {
          setComponent(Component as React.ComponentType<any>);
        }
      });
    return () => { isMount = false; }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return Component ? (
    <Route {...props} component={Component} />
  ) : null
}

export default AsyncRoute;
