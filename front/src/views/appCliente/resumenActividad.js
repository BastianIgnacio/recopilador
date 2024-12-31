/* eslint-disable camelcase */
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
import { useTable, usePagination, useSortBy } from 'react-table';
import { colorLightBlue, colorPlomo } from 'constants/defaultValues';
import TablaResumenActividad from './tablaResumenActividad';

const ResumenActividad = ({ match, client_id, ws, entorno }) => {
  // NECESITAMOS EL RESUMEN DE GANANCIAS POR RONDAS
  // MOSTRAR LA CANTIDAD DE PESOS EXPERIMENTALES OBTENIDOS POR RONDA Y EN TOTAL
  // HACER LA MULTIPLICACION DEL DINERO

  const actividadPrueba = entorno.actividad.prueba;
  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx xl="8">
          {actividadPrueba ? (
            <Card>
              <CardTitle className="text-center mt-4 font-weight-bold text-uppercase">
                Muchas gracias por finalizar la Actividad de Práctica
              </CardTitle>
              <CardTitle className="text-center font-weight-bold text-uppercase">
                Por favor esperar a los otros participantes
              </CardTitle>
            </Card>
          ) : (
            <Card>
              <div
                className="text-center font-weight-bold text-uppercase"
                style={{ paddingTop: '40px', fontSize: '24px' }}
              >
                Ha finalizado la actividad {entorno.actividad.numero}
              </div>
              <div
                className="text-center font-weight-bold text-uppercase"
                style={{ paddingTop: '20px', fontSize: '20px' }}
              >
                {' '}
                Por favor esperar a los otros participantes
              </div>
              <CardBody>
                <TablaResumenActividad
                  entorno={entorno}
                  client_id={client_id}
                />
              </CardBody>
            </Card>
          )}
        </Colxx>
      </Row>
    </>
  );
};

export default ResumenActividad;
