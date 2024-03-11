import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const NuevoExperimento = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './nuevoExperimento')
);
const Historial = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './historial')
);
const Configuracion = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/sesionGrupo1`} />
      <Route
        path={`${match.url}/sesionGrupo1`}
        render={(props) => <NuevoExperimento grupo={1} {...props} />}
      />
      <Route
        path={`${match.url}/sesionGrupo2`}
        render={(props) => <NuevoExperimento grupo={2} {...props} />}
      />
      <Route
        path={`${match.url}/historial`}
        render={(props) => <Historial {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Configuracion;
