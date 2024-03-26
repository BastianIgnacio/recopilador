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
import Notificacion from './notificacion';

import './customRadio.css';
import JugadorLabel from './jugadorLabel';

const ResultadosVotacion = ({
  match,
  id,
  socketConectado,
  club,
  notificaciones,
  traslados,
  arrayJugadores,
}) => {
  const ordenarArray = (array) => {
    array.sort((a, b) => a.letraJugador.localeCompare(b.letraJugador));
  };

  ordenarArray(arrayJugadores);

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Colxx lg="7">
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
                  RESULTADOS DE LA VOTACIÓN
                </Label>
              </div>
            </div>
            <Separator className="ml-4 mr-4 mb-2" />
            {notificaciones.map((elementNoParse) => {
              const element = JSON.parse(elementNoParse);
              return (
                <Notificacion color={element.color} mensaje={element.mensaje} />
              );
            })}
          </Card>
        </Colxx>
        <Colxx lg="5">
          <Card
            className="mb-4"
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              borderWidth: '2px',
              borderColor: colorPlomo,
              borderStyle: 'solid',
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
                  ESTADO DEL GRUPO
                </Label>
              </div>
            </div>
            <Separator className="ml-4 mr-4 mb-2" />
            <CardBody>
              {arrayJugadores.map((jugador) => {
                return (
                  <JugadorLabel
                    element={jugador}
                    id={id}
                    traslados={traslados}
                  />
                );
              })}
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default ResultadosVotacion;
