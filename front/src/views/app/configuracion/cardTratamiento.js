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

const CardTratamiento = ({ numero, tratamiento, eliminarTratamiento }) => {
  const eliminar = (tratDelete) => {
    eliminarTratamiento(tratDelete);
  };

  const editar = () => {
    console.log('editar');
  };

  return (
    <Card className="m-2">
      <div className="position-absolute card-top-buttons">
        <button
          type="button"
          className="btn btn-header-light icon-button"
          onClick={() => eliminar(tratamiento)}
        >
          <i className="simple-icon-trash" />
        </button>
      </div>
      <CardBody style={{ borderColor: 'black' }}>
        <CardTitle>
          Tratamiento N°{numero} {tratamiento.rondaPractica && '(Practica)'}
        </CardTitle>
        <div>Tipo {tratamiento.tipo.value} </div>
        <div>Rondas {tratamiento.cantidadRondas.value} </div>
      </CardBody>
    </Card>
  );
};

export default CardTratamiento;
