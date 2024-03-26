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

const FinalizarSesionAgradecimientos = ({
  match,
  id,
  grupo,
  resultadoJugadores,
}) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const row = resultadoJugadores.find((tupla) => tupla.rowTotal === true);
    if (row !== undefined) {
      setTotal(row.pesos);
    }
  }, [resultadoJugadores]);

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx xl="6">
          <Card>
            <CardTitle className="text-center font-weight-bold mt-3">
              MUCHAS GRACIAS POR PARTICIPAR EN ESTA SESIÓN EXPERIMENTAL
            </CardTitle>
            <CardBody>
              <CardText>
                TU PAGO CORRESPONDIENTE
                <p className="card-text font-weight-semibold mb-0">
                  {total} (Pesos Chilenos)
                </p>
              </CardText>
              <CardText>
                {' '}
                IMPORTANTE: RECUERDA QUE TU ERES:
                <p className="card-text font-weight-semibold mb-0">
                  EL JUGADOR {id} DEL GRUPO {grupo}.
                </p>
              </CardText>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default FinalizarSesionAgradecimientos;
