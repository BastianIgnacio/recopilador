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
  CardBody,
  Label,
  CardTitle,
  FormGroup,
  Button,
  CardFooter,
  CardSubtitle,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { colorPlomo, equipos } from 'constants/defaultValues';
import { NotificationManager } from 'components/common/react-notifications';
import { useTable, usePagination, useSortBy } from 'react-table';
import TablaRetiros from './tablaRetiros';

import { FormikCustomRadioGroupMaxExcluir } from './FormikFields';

const VotacionExcluir = ({ match, client_id, ws, entorno }) => {
  const [club, setClub] = useState('AZUL');
  const [clubColor, setClubColor] = useState(equipos[1]);
  const [bloqueado, setBloqueado] = useState(false);
  const { transicion, setTransicion } = useState('in:square:center');
  console.log(entorno);

  const ordenarArray = (array) => {
    console.log(array);
    array.sort((a, b) => a.letra.localeCompare(b.letra));
    return array;
  };

  const generarOpcionesVotacion = (array) => {
    const arrayOpctions = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < array.length; i++) {
      if (array[i].club === 'AZUL') {
        if (array[i].client_id !== client_id) {
          const a = {
            value: parseInt(array[i].client_id, 10),
            label: `Jugador ${array[i].letra}`,
            disabled: false,
          };
          arrayOpctions.push(a);
        }
      } else if (array[i].client_id !== client_id) {
        const a = {
          value: parseInt(array[i].client_id, 10),
          label: `Jugador ${array[i].letra}`,
          disabled: true,
        };
        arrayOpctions.push(a);
      }
    }
    arrayOpctions.push({
      value: 'no',
      label: 'No trasladar a ningún integrante',
    });
    return arrayOpctions;
  };

  const generarOpcionesVotacionAmarillo = (array) => {
    const arrayOpctions = [];
    arrayOpctions.push({
      value: 'no',
      label: 'Yo no puedo votar',
    });
    return arrayOpctions;
  };

  const onSubmitAmarillo = (values, { setSubmitting }) => {
    const payload = {
      ...values,
    };
    if (payload.customRadioGroup.length === 0) {
      NotificationManager.warning(
        '',
        'Debes seleccionar la unica opcion',
        3000,
        null,
        null,
        'filled'
      );
      return;
    }
    // BLOQUEAMOS EL BOTON PARA QUE NO PUEDA VOTAR NUEVAMENTE
    setBloqueado(true);

    // CREAMOS EL PAQUETE DEL VOTO
    const data = {
      tipo: 'VOTACION_AMARILLO',
      voto: payload.customRadioGroup[0],
    };

    setTimeout(() => {
      const jsonSend = {
        tipo: 'ENVIAR_VOTACION_EXCLUIR',
        data,
      };
      const dataQuery = JSON.stringify(jsonSend);
      console.log(dataQuery);
      ws.send(dataQuery);

      setSubmitting(false);
    }, 50);
  };

  const onSubmitAzul = (values, { setSubmitting }) => {
    const payload = {
      ...values,
    };
    if (payload.customRadioGroup.length === 0) {
      NotificationManager.warning(
        '',
        'Debes seleccionar una opción',
        3000,
        null,
        null,
        'filled'
      );
      return;
    }
    // BLOQUEAMOS EL BOTON PARA QUE NO PUEDA VOLVER A VOTAR
    setBloqueado(true);

    // CREAMOS EL PAQUETE DEL VOTO
    const data = {
      tipo: 'VOTACION_AZUL',
      voto: payload.customRadioGroup[0],
    };

    setTimeout(() => {
      const jsonSend = {
        tipo: 'ENVIAR_VOTACION_EXCLUIR',
        data,
      };
      const dataQuery = JSON.stringify(jsonSend);
      console.log(dataQuery);
      ws.send(dataQuery);

      setSubmitting(false);
    }, 50);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_id, entorno]);

  return (
    <Card>
      <CardBody
        transition-style="in:square:center"
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
            <Card className="mb-4">
              <div
                style={{
                  backgroundColor: clubColor.color,
                  borderRadius: '10px',
                }}
              >
                <div className="text-center mt-3 ml-3">
                  <Label className="h4" style={{ color: 'white' }}>
                    VOTACIÓN EXCLUSIÓN
                  </Label>
                </div>
              </div>
              {club === 'AMARILLO' && (
                <Formik
                  initialValues={{
                    customRadioGroup: [],
                  }}
                  // validationSchema={SignupSchema}
                  onSubmit={onSubmitAmarillo}
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
                      <CardBody
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '10px',
                        }}
                      >
                        {!bloqueado ? (
                          <>
                            <div>
                              <div
                                style={{
                                  backgroundColor: colorPlomo,
                                  borderRadius: '10px',
                                  margin: '0px 2px 30px 2px',
                                }}
                              >
                                <div
                                  className="text-center"
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '24px',
                                    color: 'black',
                                    alignSelf: 'center',
                                    padding: '5px 5px 5px 5px',
                                  }}
                                >
                                  {' '}
                                  En esta ronda usted no puede votar porque
                                  pertenece al Club Amarillo
                                </div>
                              </div>
                            </div>
                            <FormGroup className="error-l-175">
                              <FormikCustomRadioGroupMaxExcluir
                                name="customRadioGroup"
                                id="customRadioGroup"
                                label="Which of these?"
                                values={values.customRadioGroup}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                options={generarOpcionesVotacionAmarillo()}
                                max={1}
                              />
                              {errors.customRadioGroup &&
                              touched.customRadioGroup ? (
                                <div className="invalid-feedback d-block">
                                  {errors.customRadioGroup}
                                </div>
                              ) : null}
                            </FormGroup>
                          </>
                        ) : (
                          <CardTitle>Gracias por su votación</CardTitle>
                        )}
                      </CardBody>
                      <CardFooter>
                        <Button
                          block
                          style={{
                            backgroundColor: clubColor.color,
                            fontWeight: 'bold',
                            fontSize: '24px',
                            color: clubColor.colorLetra,
                          }}
                          type="submit"
                          disabled={bloqueado}
                        >
                          {!bloqueado
                            ? 'Enviar Votación'
                            : 'Esperando a los otros participantes..'}
                        </Button>
                      </CardFooter>
                    </Form>
                  )}
                </Formik>
              )}
              {club === 'AZUL' && (
                <Formik
                  initialValues={{
                    customRadioGroup: [],
                  }}
                  // validationSchema={SignupSchema}
                  onSubmit={onSubmitAzul}
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
                      <CardBody
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '10px',
                        }}
                      >
                        {!bloqueado ? (
                          <>
                            <div>
                              <div
                                style={{
                                  backgroundColor: colorPlomo,
                                  borderRadius: '10px',
                                  margin: '0px 2px 30px 2px',
                                }}
                              >
                                <div
                                  className="text-center"
                                  style={{
                                    fontWeight: 'bold',
                                    fontSize: '24px',
                                    color: 'black',
                                    alignSelf: 'center',
                                    padding: '5px 5px 5px 5px',
                                  }}
                                >
                                  {' '}
                                  En esta ronda usted puede votar para trasladar
                                  un máximo de 1 integrante al Club Amarillo.
                                </div>
                              </div>
                            </div>
                            <FormGroup className="error-l-175">
                              <FormikCustomRadioGroupMaxExcluir
                                name="customRadioGroup"
                                id="customRadioGroup"
                                label="Which of these?"
                                values={values.customRadioGroup}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                options={generarOpcionesVotacion(
                                  ordenarArray(entorno.actividad.jugadores)
                                )}
                                max={1}
                              />
                              {errors.customRadioGroup &&
                              touched.customRadioGroup ? (
                                <div className="invalid-feedback d-block">
                                  {errors.customRadioGroup}
                                </div>
                              ) : null}
                            </FormGroup>
                          </>
                        ) : (
                          <CardTitle>Gracias por su votación</CardTitle>
                        )}
                      </CardBody>
                      <CardFooter>
                        <Button
                          block
                          style={{
                            backgroundColor: clubColor.color,
                            fontWeight: 'bold',
                            fontSize: '20px',
                            color: clubColor.colorLetra,
                          }}
                          type="submit"
                          disabled={bloqueado}
                        >
                          {!bloqueado
                            ? 'Enviar Votación'
                            : 'Esperando a los otros participantes..'}
                        </Button>
                      </CardFooter>
                    </Form>
                  )}
                </Formik>
              )}
            </Card>
          </Colxx>
        </Row>
      </CardBody>
    </Card>
  );
};

export default VotacionExcluir;
