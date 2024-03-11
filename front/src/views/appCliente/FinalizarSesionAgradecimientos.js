/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Label,
  Row,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';

const FinalizarSesionAgradecimientos = ({ match, idWs, grupo }) => {
  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx xl="6">
          <Card>
            <CardTitle className="m-3 ">
              {' '}
              Muchas gracias por participar en esta sesion experimental
            </CardTitle>
            <CardBody>
              <CardText>
                Ahora puedes pasar por el pago correspondiente, recuerda que tu
                identificacion es la letra {idWs} y tu grupo es el {grupo}.
              </CardText>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default FinalizarSesionAgradecimientos;
