/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Row, Card, CardBody, Label } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import {
  colorBlue,
  colorYellow,
  colorCrema,
  colorPlomo,
  colorLightBlue,
  colorLightYellow,
} from 'constants/defaultValues';

import './transiciones.css';
import JugadorLabel from './jugadorLabelInclusion';

const ResultadoInclusion = ({ match, client_id, ws, entorno }) => {
  const arrayInclusion = entorno.actividad.resultadosIncluir.incluidos;
  const [arrayNotificaciones, setArrayNotificacion] = useState([]);

  // eslint-disable-next-line no-restricted-syntax
  for (const jugadorExcluido of arrayInclusion) {
    console.log(jugadorExcluido);
    const { label } = entorno.actividad.jugadores.find(
      (jugador) => jugador.client_id === jugadorExcluido
    );
    arrayNotificaciones.push({
      label: `El ${label}  ha sido movido al club azul`,
      color: '#001840',
      colorLetra: 'white',
    });
  }
  if (arrayNotificaciones.length === 0) {
    arrayNotificaciones.push({
      label: `Ningun jugador ha sido movido al club azul`,
      color: '#E3E3E3',
      colorLetra: 'black',
    });
  }
  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx lg="12">
          <Card
            className="mb-4"
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
            }}
          >
            <div
              style={{ backgroundColor: 'transparent', borderRadius: '10px' }}
              className="ml-2 mr-2 mt-2 mb-2"
            >
              <div className="text-center mt-2 ml-4">
                <Label
                  className="h3"
                  style={{ color: 'black', fontWeight: 'bold' }}
                >
                  RESULTADOS DE LA VOTACIÓN INCLUSIÓN
                </Label>
              </div>
            </div>
            <Separator className="ml-4 mr-4 mb-2" />{' '}
            <Row className="d-flex justify-content-center">
              {arrayNotificaciones.map((notificacion) => {
                return (
                  <Colxx lg="8">
                    {' '}
                    <div
                      style={{
                        backgroundColor: notificacion.color,
                        borderRadius: '10px',
                      }}
                      className="ml-2 mr-2 mt-2 mb-2"
                    >
                      <div className="text-center mt-4 ml-4">
                        <Label
                          className="h2"
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {notificacion.label}
                        </Label>
                      </div>
                    </div>
                  </Colxx>
                );
              })}
              <Colxx lg="10">
                <Card
                  className="mb-4 mt-4"
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    borderWidth: '2px',
                    borderColor: colorPlomo,
                    borderStyle: 'solid',
                  }}
                >
                  <CardBody>
                    <Row>
                      {entorno.actividad.jugadores.map((jugador) => {
                        return (
                          <Colxx lg="3">
                            <JugadorLabel
                              element={jugador}
                              client_id={client_id}
                              transicionInclusion={arrayInclusion}
                            />
                          </Colxx>
                        );
                      })}
                    </Row>
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default ResultadoInclusion;
