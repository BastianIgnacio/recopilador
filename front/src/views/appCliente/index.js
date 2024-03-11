import React, { Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from 'layout/AppLayoutClient';
// import { ProtectedRoute, UserRole } from 'helpers/authHelper';

const FrameAppCliente = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './frameApp')
);

const App = ({ match }) => {
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect exact from={`${match.url}/`} to="/error" />
            {/* <ProtectedRoute
              path={`${match.url}/second-menu`}
              component={SecondMenu}
              roles={[UserRole.Admin]}
      /> */}
            <Route
              path={`${match.url}/:id`}
              render={(props) => <FrameAppCliente {...props} />}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
