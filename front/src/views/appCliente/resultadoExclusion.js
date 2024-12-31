/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Row, Card, CardBody, Label, Button } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { colorPlomo } from 'constants/defaultValues';

import './transiciones.css';
import JugadorLabel from './jugadorLabelExclusion';

const ResultadoExclusion = ({ match, client_id, ws, entorno }) => {
  const arrayExclusion = entorno.actividad.resultadosExcluir.excluidos;
  const [arrayNotificaciones, setArrayNotificacion] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);

  const confirmar = () => {
    setBloqueado(true);
    const data = {};
    setTimeout(() => {
      const jsonSend = {
        tipo: 'CONFIRMAR_RESULTADOS_VOTACION_EXCLUIR',
        data,
      };
      const dataQuery = JSON.stringify(jsonSend);
      ws.send(dataQuery);
    }, 100);
  };

  useEffect(() => {
    // CHECKEAMOS SI LA VISTA DEBE ESTAR BLOQUEADA
    const vistasBloqueadas = entorno.vistas;
    const vistaBloqueada = vistasBloqueadas.find(
      (vistaElement) => vistaElement.client_id === client_id
    );
    setBloqueado(vistaBloqueada.bloqueado);

    const array = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const jugadorExcluido of arrayExclusion) {
      const jugadorEncontrado = entorno.actividad.jugadores.find(
        (jugador) => jugador.client_id === jugadorExcluido
      );

      if (jugadorEncontrado.client_id === client_id) {
        array.push({
          label: `Usted ha sido trasladado al Club Amarillo`,
          color: '#F5C400',
          colorLetra: 'black',
        });
      } else {
        array.push({
          label: `${jugadorEncontrado.label} ha sido trasladado al Club Amarillo`,
          color: '#F5C400',
          colorLetra: 'black',
        });
      }
    }

    if (array.length === 0) {
      array.push({
        label: `Ningún jugador ha sido trasladado al Club Amarillo`,
        color: '#E3E3E3',
        colorLetra: 'black',
      });
    }
    setArrayNotificacion(array);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(arrayNotificaciones);

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
                  RESULTADOS DE LA VOTACIÓN - EXCLUSIÓN
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
                      <div className="text-center p-4">
                        <Label
                          className="h2"
                          style={{
                            color: notificacion.colorLetra,
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
              <Colxx lg="11">
                <Card
                  className="mb-4 mt-4"
                  style={{
                    backgroundColor: colorPlomo,
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
                              transicionExclusion={arrayExclusion}
                            />
                          </Colxx>
                        );
                      })}
                    </Row>
                  </CardBody>
                </Card>
              </Colxx>
              <Colxx lg="8">
                <Button
                  block
                  onClick={confirmar}
                  style={{
                    backgroundColor: colorPlomo,
                    fontWeight: 'bold',
                    fontSize: '20px',
                    color: 'black',
                    marginBottom: '20px',
                    borderColor: 'transparent',
                  }}
                  disabled={bloqueado}
                >
                  {!bloqueado
                    ? 'CONTINUAR'
                    : 'Esperando a los otros participantes..'}
                </Button>
              </Colxx>
            </Row>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default ResultadoExclusion;
