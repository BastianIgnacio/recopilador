/* eslint-disable no-unused-vars */
import React from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Badge,
  CardFooter,
  Button,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';

const CardTratamiento = ({ numeroActividad }) => {
  return (
    <Card className="m-2">
      <CardBody style={{ borderColor: 'black' }}>
        <CardTitle>Numero actividad N°{numeroActividad}</CardTitle>
      </CardBody>
    </Card>
  );
};

export default CardTratamiento;
