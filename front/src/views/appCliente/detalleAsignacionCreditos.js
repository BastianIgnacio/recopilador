/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import {
  Row,
  Card,
  CardBody,
  Label,
  CardFooter,
  Button,
  Table,
  CardTitle,
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import {
  colorBlue,
  colorYellow,
  colorCrema,
  colorPlomo,
  colorLightBlue,
  colorLightYellow,
  equipos,
} from 'constants/defaultValues';
import './tablas.css';

const DetalleAsignacionCreditos = ({ match, client_id, ws, entorno }) => {
  const [club, setClub] = useState('AZUL');
  const [clubColor, setClubColor] = useState(equipos[1]);
  const [bloqueado, setBloqueado] = useState(false);

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

  useEffect(() => {
    const equipoFind = equipos.find(
      (equipoElement) => equipoElement.club === club
    );
    setClubColor(equipoFind);
  }, [club]);

  const asignacion = entorno.actividad.asignaciones.find(
    (element) =>
      element.jugador === client_id &&
      element.ronda === entorno.actividad.rondaActual
  );

  const confirmar = () => {
    console.log('confirmando');
    setBloqueado(true);
    const jsonSend = {
      tipo: 'CONFIRMAR_DETALLE_ASIGNACION_CREDITOS',
      data: '',
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
  };
  console.log(asignacion);

  return (
    <Card>
      <CardBody
        transition-style="in:wipe:right"
        style={{
          backgroundColor: clubColor.colorLight,
          borderRadius: '10px',
        }}
      >
        <Row className="d-flex justify-content-center">
          <Colxx lg="10">
            <Card
              className="mb-4"
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
              }}
            >
              <CardBody>
                <div
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: '10px',
                  }}
                  className="ml-2 mr-2 mt-2 mb-2"
                >
                  <div className="text-center mt-2 ml-4">
                    <Label
                      className="h3"
                      style={{ color: 'black', fontWeight: 'bold' }}
                    >
                      DETALLE DE TUS GANANCIAS EN ESTA RONDA
                    </Label>
                  </div>
                </div>
                <div className="text-left mt-2 ml-4">
                  <Row>
                    {entorno.actividad.tratamiento === 'T1' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      RONDA N°{entorno.actividad.numero}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      Tus fichas extraidas desde la cuenta club
                                      azul
                                    </td>
                                    <td>{asignacion.fichasClub}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Tus fichas destinadas actividad privada
                                    </td>
                                    <td>{asignacion.fichasActividadPrivada}</td>
                                  </tr>
                                  <tr>
                                    <td>Las fichas restantes club azul</td>
                                    <td>
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      CALCULOS PESOS EXPERIMENTALES
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143; Fichas Actividad privada * 1$ +
                                      Fichas Club * 4$ + Cantidad Fichas
                                      restantes club Azul * 2$
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada} * 1$ +{' '}
                                      {asignacion.fichasClub} * 4$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul} * 2$
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada * 1}$ +{' '}
                                      {asignacion.fichasClub * 4}$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul * 2}$
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      {' '}
                                      &#10143;{' '}
                                      {asignacion.resultadoPesosExperimentales}$
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <>
                            <Card>
                              <CardBody>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        RONDA N°{entorno.actividad.numero}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        Tus fichas extraidas desde la cuenta
                                        club amarillo
                                      </td>
                                      <td>{asignacion.fichasClub}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Tus fichas destinadas actividad privada
                                      </td>
                                      <td>
                                        {asignacion.fichasActividadPrivada}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Las fichas restantes club amarillo
                                      </td>
                                      <td>
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        CALCULOS PESOS EXPERIMENTALES
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143; Fichas Actividad privada *
                                        0.25$ + Fichas Club * 1$ + Cantidad
                                        Fichas restantes restantes club Amarillo
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada} *
                                        0.25$ + {asignacion.fichasClub} * 1$ +{' '}
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }{' '}
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada *
                                          0.25}
                                        $ + {asignacion.fichasClub * 1}$ +{' '}
                                        {asignacion.cantidadFichasQuedanAmarillo *
                                          0.5}
                                        $
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        {' '}
                                        &#10143;{' '}
                                        {
                                          asignacion.resultadoPesosExperimentales
                                        }
                                        $
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </CardBody>
                            </Card>
                          </>
                        )}
                      </Colxx>
                    )}
                    {entorno.actividad.tratamiento === 'T2' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      RONDA N°{entorno.actividad.numero}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      Tus fichas extraidas desde la cuenta club
                                      azul
                                    </td>
                                    <td>{asignacion.fichasClub}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Tus fichas destinadas actividad privada
                                    </td>
                                    <td>{asignacion.fichasActividadPrivada}</td>
                                  </tr>
                                  <tr>
                                    <td>Las fichas restantes club azul</td>
                                    <td>
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Costo de exclusion</td>
                                    <td>
                                      {asignacion.cantidadJugadoresAmarillo} *
                                      $8 &#10143; $
                                      {asignacion.cantidadJugadoresAmarillo * 8}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      CALCULOS PESOS EXPERIMENTALES
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143; Fichas Actividad privada * 1$ +
                                      Fichas Club * 4$ + Cantidad Fichas
                                      restantes club Azul * 2$ - Costo de
                                      exclusion
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada} * 1$ +{' '}
                                      {asignacion.fichasClub} * 4$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul} * 2$
                                      - Costo de exclusion
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada * 1}$ +{' '}
                                      {asignacion.fichasClub * 4}$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul * 2}$
                                      - $
                                      {asignacion.cantidadJugadoresAmarillo * 8}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      {' '}
                                      &#10143;{' '}
                                      {asignacion.resultadoPesosExperimentales}$
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <>
                            <Card>
                              <CardBody>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        RONDA N°{entorno.actividad.numero}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        Tus fichas extraidas desde la cuenta
                                        club amarillo
                                      </td>
                                      <td>{asignacion.fichasClub}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Tus fichas destinadas actividad privada
                                      </td>
                                      <td>
                                        {asignacion.fichasActividadPrivada}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Las fichas restantes club amarillo
                                      </td>
                                      <td>
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        CALCULOS PESOS EXPERIMENTALES
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143; Fichas Actividad privada *
                                        0.25$ + Fichas Club * 1$ + Cantidad
                                        Fichas restantes restantes club Amarillo
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada} *
                                        0.25$ + {asignacion.fichasClub} * 1$ +{' '}
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }{' '}
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada *
                                          0.25}
                                        $ + {asignacion.fichasClub * 1}$ +{' '}
                                        {asignacion.cantidadFichasQuedanAmarillo *
                                          0.5}
                                        $
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        {' '}
                                        &#10143;{' '}
                                        {
                                          asignacion.resultadoPesosExperimentales
                                        }
                                        $
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </CardBody>
                            </Card>
                          </>
                        )}
                      </Colxx>
                    )}
                    {entorno.actividad.tratamiento === 'T3' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      RONDA N°{entorno.actividad.numero}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      Tus fichas extraidas desde la cuenta club
                                      azul
                                    </td>
                                    <td>{asignacion.fichasClub}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Tus fichas destinadas actividad privada
                                    </td>
                                    <td>{asignacion.fichasActividadPrivada}</td>
                                  </tr>
                                  <tr>
                                    <td>Las fichas restantes club azul</td>
                                    <td>
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Costo de exclusion</td>
                                    <td>
                                      {asignacion.cantidadJugadoresAmarillo} *
                                      $8 &#10143; $
                                      {asignacion.cantidadJugadoresAmarillo * 8}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Costo de inclusion</td>
                                    <td>
                                      {asignacion.cantidadJugadoresAzul} * $8
                                      &#10143; $
                                      {asignacion.cantidadJugadoresAzul * 8}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      CALCULOS PESOS EXPERIMENTALES
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143; Fichas Actividad privada * 1$ +
                                      Fichas Club * 4$ + Cantidad Fichas
                                      restantes club Azul * 2$ - Costo de
                                      exclusion - Costo de inclusion
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada} * 1$ +{' '}
                                      {asignacion.fichasClub} * 4$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul} * 2$
                                      - Costo de exclusion - Costo de inclusion
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada * 1}$ +{' '}
                                      {asignacion.fichasClub * 4}$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul * 2}$
                                      - $
                                      {asignacion.cantidadJugadoresAmarillo * 8}
                                      - ${asignacion.cantidadJugadoresAzul * 8}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      {' '}
                                      &#10143;{' '}
                                      {asignacion.resultadoPesosExperimentales}$
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <>
                            <Card>
                              <CardBody>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        RONDA N°{entorno.actividad.numero}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        Tus fichas extraidas desde la cuenta
                                        club amarillo
                                      </td>
                                      <td>{asignacion.fichasClub}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Tus fichas destinadas actividad privada
                                      </td>
                                      <td>
                                        {asignacion.fichasActividadPrivada}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Las fichas restantes club amarillo
                                      </td>
                                      <td>
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        CALCULOS PESOS EXPERIMENTALES
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143; Fichas Actividad privada *
                                        0.25$ + Fichas Club * 1$ + Cantidad
                                        Fichas restantes restantes club Amarillo
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada} *
                                        0.25$ + {asignacion.fichasClub} * 1$ +{' '}
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }{' '}
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada *
                                          0.25}
                                        $ + {asignacion.fichasClub * 1}$ +{' '}
                                        {asignacion.cantidadFichasQuedanAmarillo *
                                          0.5}
                                        $
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        {' '}
                                        &#10143;{' '}
                                        {
                                          asignacion.resultadoPesosExperimentales
                                        }
                                        $
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </CardBody>
                            </Card>
                          </>
                        )}
                      </Colxx>
                    )}
                    {entorno.actividad.tratamiento === 'T4' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      RONDA N°{entorno.actividad.numero}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      Tus fichas extraidas desde la cuenta club
                                      azul
                                    </td>
                                    <td>{asignacion.fichasClub}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Tus fichas destinadas actividad privada
                                    </td>
                                    <td>{asignacion.fichasActividadPrivada}</td>
                                  </tr>
                                  <tr>
                                    <td>Las fichas restantes club azul</td>
                                    <td>
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Costo de inclusion</td>
                                    <td>
                                      {asignacion.cantidadJugadoresAzul} * $8
                                      &#10143; $
                                      {asignacion.cantidadJugadoresAzul * 8}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th colSpan="2">
                                      CALCULOS PESOS EXPERIMENTALES
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143; Fichas Actividad privada * 1$ +
                                      Fichas Club * 4$ + Cantidad Fichas
                                      restantes club Azul * 2$ - Costo de
                                      inclusion
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada} * 1$ +{' '}
                                      {asignacion.fichasClub} * 4$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul} * 2$
                                      - Costo de inclusion
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      &#10143;{' '}
                                      {asignacion.fichasActividadPrivada * 1}$ +{' '}
                                      {asignacion.fichasClub * 4}$ +{' '}
                                      {asignacion.cantidadFichasQuedanAzul * 2}$
                                      - ${asignacion.cantidadJugadoresAzul * 8}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>Pesos experimentales</td>
                                    <td>
                                      {' '}
                                      &#10143;{' '}
                                      {asignacion.resultadoPesosExperimentales}$
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <>
                            <Card>
                              <CardBody>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        RONDA N°{entorno.actividad.numero}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        Tus fichas extraidas desde la cuenta
                                        club amarillo
                                      </td>
                                      <td>{asignacion.fichasClub}</td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Tus fichas destinadas actividad privada
                                      </td>
                                      <td>
                                        {asignacion.fichasActividadPrivada}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Las fichas restantes club amarillo
                                      </td>
                                      <td>
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                                <Table bordered>
                                  <thead>
                                    <tr>
                                      <th colSpan="2">
                                        CALCULOS PESOS EXPERIMENTALES
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143; Fichas Actividad privada *
                                        0.25$ + Fichas Club * 1$ + Cantidad
                                        Fichas restantes restantes club Amarillo
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada} *
                                        0.25$ + {asignacion.fichasClub} * 1$ +{' '}
                                        {
                                          asignacion.cantidadFichasQuedanAmarillo
                                        }{' '}
                                        * 0.5$
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        &#10143;{' '}
                                        {asignacion.fichasActividadPrivada *
                                          0.25}
                                        $ + {asignacion.fichasClub * 1}$ +{' '}
                                        {asignacion.cantidadFichasQuedanAmarillo *
                                          0.5}
                                        $
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Pesos experimentales</td>
                                      <td>
                                        {' '}
                                        &#10143;{' '}
                                        {
                                          asignacion.resultadoPesosExperimentales
                                        }
                                        $
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </CardBody>
                            </Card>
                          </>
                        )}
                      </Colxx>
                    )}
                  </Row>
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  className="mt-2"
                  block
                  onClick={confirmar}
                  style={{
                    backgroundColor: clubColor.color,
                    fontWeight: 'bold',
                    fontSize: '20px',
                  }}
                  disabled={bloqueado}
                >
                  {!bloqueado
                    ? 'Confirmar'
                    : 'Esperando a los otros participantes..'}
                </Button>
              </CardFooter>
            </Card>
          </Colxx>
        </Row>
      </CardBody>
    </Card>
  );
};

export default DetalleAsignacionCreditos;
