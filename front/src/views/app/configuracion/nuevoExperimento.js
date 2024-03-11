/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Row, Card, CardBody, CardTitle, Badge } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import Experimento1 from './experimento_1';
import Experimento2 from './experimento_2';

const NuevoExperimento = ({ match, grupo }) => (
  <>
    <Row>
      <Colxx xxs="12">
        <Breadcrumb heading="menu.nuevoExperimento" match={match} />
        <Separator className="mb-5" />
      </Colxx>
    </Row>
    <Row>
      <Colxx xl="12" className="mb-4">
        {grupo === 1 && <Experimento1 />}
        {grupo === 2 && <Experimento2 />}
      </Colxx>
    </Row>
  </>
);
export default NuevoExperimento;
