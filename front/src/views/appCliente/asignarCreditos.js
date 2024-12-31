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
  Row,
  Card,
  Button,
  CardBody,
  CardText,
  CardTitle,
  FormGroup,
  Label,
  CardHeader,
  CardFooter,
  CardSubtitle,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import { equipos } from 'constants/defaultValues';
import TablaRetiros from './tablaRetiros_enAsignacion';

const AsignarCreditos = ({ match, client_id, ws, entorno }) => {
  const [club, setClub] = useState('AZUL');
  const [clubColor, setClubColor] = useState(equipos[1]);
  const [jugador, setJugador] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);

  const onSubmit = (values, { setSubmitting }) => {
    setBloqueado(true);
    const payload = {
      ...values,
    };
    const data = {
      fichasClub: parseInt(payload.select, 10),
      fichasActividadPrivada: parseInt(payload.actividad, 10),
    };

    setTimeout(() => {
      const jsonSend = {
        tipo: 'ENVIAR_ASIGNACION_CREDITOS',
        data,
      };
      const dataQuery = JSON.stringify(jsonSend);
      ws.send(dataQuery);

      setSubmitting(false);
    }, 500);
  };

  useEffect(() => {
    const equipoFind = equipos.find(
      (equipoElement) => equipoElement.club === club
    );
    setClubColor(equipoFind);
  }, [club]);

  useEffect(() => {
    // CHECKEAMOS SI LA VISTA DEBE ESTAR BLOQUEADA
    const vistasBloqueadas = entorno.vistas;
    const vistaBloqueada = vistasBloqueadas.find(
      (vistaElement) => vistaElement.client_id === client_id
    );
    setBloqueado(vistaBloqueada.bloqueado);

    // CHECKEAMOS EL CLUB AL QUE PERTENECE EL JUGADOR
    const jugadorClub = entorno.actividad.jugadores.find(
      (jugadorElement) => jugadorElement.client_id === client_id
    );
    setClub(jugadorClub.club);
    setJugador(jugadorClub);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_id, entorno]);

  return (
    <Card>
      <CardBody
        style={{
          backgroundColor: clubColor.colorLight,
          borderRadius: '10px',
        }}
      >
        <Row className="d-flex justify-content-center">
          <Colxx lg="9">
            <TablaRetiros client_id={client_id} entorno={entorno} />
          </Colxx>
          <Colxx lg="3">
            {club === 'AZUL' && (
              <div>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    backgroundColor: '#001840',
                    borderRadius: '10px',
                    margin: '0px 10px 30px 10px',
                  }}
                >
                  <div
                    className="text-center"
                    style={{
                      fontWeight: 'bold',
                      fontSize: '30px',
                      color: 'white',
                      alignSelf: 'center',
                      padding: '20px',
                    }}
                  >
                    {' '}
                    En esta ronda usted es integrante del Club Azul
                  </div>
                </div>
              </div>
            )}
            {club === 'AMARILLO' && (
              <div>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    backgroundColor: '#F5C400',
                    borderRadius: '10px',
                    margin: '0px 10px 30px 10px',
                  }}
                >
                  <div
                    className="text-center"
                    style={{
                      fontWeight: 'bold',
                      fontSize: '30px',
                      color: 'black',
                      alignSelf: 'center',
                      padding: '20px',
                    }}
                  >
                    {' '}
                    En esta ronda usted es integrante del Club Amarillo
                  </div>
                </div>
              </div>
            )}
            <Card className="mb-4">
              <div
                style={{
                  backgroundColor: clubColor.color,
                  borderRadius: '0px 0px 10px 10px',
                }}
              >
                <div className="text-center mt-2">
                  <div
                    style={{
                      color: clubColor.colorLetra,
                      fontWeight: 'bold',
                      fontSize: '20px',
                    }}
                  >
                    Ronda {entorno.actividad.rondaActual} de{' '}
                    {entorno.actividad.rondas}
                  </div>
                </div>
                <div className="text-center mb-2">
                  <div
                    style={{
                      color: clubColor.colorLetra,
                      fontWeight: 'bold',
                      fontSize: '20px',
                    }}
                  >
                    Ingresa tu decisión aqui
                  </div>
                </div>
              </div>
              <Formik
                initialValues={{
                  select: '0',
                  actividad: 5,
                }}
                onSubmit={onSubmit}
              >
                {({
                  handleSubmit,
                  setFieldValue,
                  setFieldTouched,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <Form className="av-tooltip tooltip-label-right">
                    <CardBody>
                      <div
                        style={{
                          borderStyle: 'solid',
                          borderRadius: '10px',
                          borderColor: clubColor.color,
                        }}
                        className="m-1"
                      >
                        {!bloqueado ? (
                          <>
                            <div className="text-left mt-3 pl-3">
                              <Label
                                style={{ fontWeight: 'bold', fontSize: '20px' }}
                              >
                                Decide cómo asignar tus 5 fichas
                              </Label>
                            </div>
                            <FormGroup
                              className="error-l-100 pt-3 pl-3 pr-3"
                              row
                            >
                              {club === 'AMARILLO' && (
                                <Label
                                  sm={8}
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                  }}
                                >
                                  Retirar de la cuenta del club amarillo
                                </Label>
                              )}
                              {club === 'AZUL' && (
                                <Label
                                  sm={8}
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                  }}
                                >
                                  Retirar de la cuenta del club azul
                                </Label>
                              )}
                              <Colxx sm={4}>
                                {' '}
                                <select
                                  name="select"
                                  className="form-control"
                                  value={values.select}
                                  disabled={bloqueado}
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                  }}
                                  onChange={(event) => {
                                    setFieldValue('select', event.target.value);
                                    const cuentaAzul = parseInt(
                                      event.target.value,
                                      10
                                    );
                                    const activadaPrivada = 5 - cuentaAzul;
                                    setFieldValue('actividad', activadaPrivada);
                                  }}
                                  onBlur={handleBlur}
                                >
                                  <option value="0'">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                                {errors.select && touched.select ? (
                                  <div className="invalid-feedback d-block">
                                    {errors.select}
                                  </div>
                                ) : null}
                              </Colxx>
                            </FormGroup>
                            <FormGroup
                              className="error-l-100 pl-3 pr-3 mb-2"
                              row
                            >
                              <Label
                                sm={8}
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                }}
                              >
                                Fichas en cuenta privada
                              </Label>
                              <Colxx sm={4}>
                                <Label
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                  }}
                                >
                                  {values.actividad}
                                </Label>
                              </Colxx>
                            </FormGroup>
                          </>
                        ) : (
                          <div className="text-center mt-3 pl-3">
                            <Label style={{ fontWeight: 'bold' }}>
                              Ya fue enviada tu decisión!
                            </Label>
                          </div>
                        )}
                      </div>
                    </CardBody>
                    <CardFooter>
                      <Button
                        className="mt-2"
                        block
                        type="submit"
                        style={{
                          backgroundColor: clubColor.color,
                          fontWeight: 'bold',
                          fontSize: '20px',
                          color: clubColor.colorLetra,
                        }}
                        disabled={bloqueado}
                      >
                        {!bloqueado
                          ? 'Enviar'
                          : 'Esperando a los otros participantes..'}
                      </Button>
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            </Card>
          </Colxx>
        </Row>
      </CardBody>
    </Card>
  );
};

export default AsignarCreditos;
