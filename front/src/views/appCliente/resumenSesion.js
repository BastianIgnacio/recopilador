/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Card, CardBody, CardText, CardTitle, Label, Row } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';

import { useTable, usePagination, useSortBy } from 'react-table';
import { colorLightBlue, colorPlomo } from 'constants/defaultValues';

const ResumenSesion = ({ match, id, idWs, info, club, resultadoJugadores }) => {
  // NECESITAMOS EL RESUMEN DE GANANCIAS POR RONDAS
  // MOSTRAR LA CANTIDAD DE PESOS EXPERIMENTALES OBTENIDOS POR RONDA Y EN TOTAL
  // HACER LA MULTIPLICACION DEL DINERO

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx xl="6">
          <Card>
            <CardTitle className="mt-3 text-center font-weight-bold">
              La sesión experimental ha finalizado
            </CardTitle>
            <CardBody>TABLA</CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default ResumenSesion;
