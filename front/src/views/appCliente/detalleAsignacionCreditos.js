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
} from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { equipos } from 'constants/defaultValues';
import './tablaDetalleAsignacion.css';

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
          <Colxx lg="12">
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
                  <div className="text-left mt-2 ml-4">
                    <Label
                      className="h4"
                      style={{ color: 'black', fontWeight: 'bold' }}
                    >
                      DETALLE DE TUS GANANCIAS EN ESTA RONDA
                    </Label>
                  </div>
                </div>
                <div>
                  <Row>
                    {entorno.actividad.tratamiento === 'T1' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered className="tablaCompleta">
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 16
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${asignacion.fichasClub * 16}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.fichasActividadPrivada * 4
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Azul
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 8
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.cantidadFichasQuedanAzul * 8
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="3" className="totalLabel">
                                      Base
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      $E 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right"
                                    >
                                      Total
                                    </td>
                                    <td className="totalBlue number textoDetalle">
                                      {`$E ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${asignacion.fichasClub * 4}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 1
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.fichasActividadPrivada * 1
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Amarillo
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 2
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAmarillo}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.cantidadFichasQuedanAmarillo *
                                        2
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3} className="totalLabel ">
                                      Base
                                    </td>
                                    <td className="number lightYellow  textoDetalle">
                                      E$ 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right "
                                    >
                                      Total
                                    </td>
                                    <td className="number totalYellow textoDetalle">
                                      {`E$ ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                      </Colxx>
                    )}
                    {entorno.actividad.tratamiento === 'T2' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered className="tablaCompleta">
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 16
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${asignacion.fichasClub * 16}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.fichasActividadPrivada * 4
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Azul
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 8
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.cantidadFichasQuedanAzul * 8
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Costos Exclusión
                                    </td>
                                    <td
                                      colSpan="2"
                                      className="number textoDetalle"
                                    >
                                      E$ 32 x{' '}
                                      {asignacion.cantidadJugadoresAmarillo}{' '}
                                      (Jugadores amarillos)
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      -
                                      {`$E ${
                                        asignacion.cantidadJugadoresAmarillo *
                                        32
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="3" className="totalLabel">
                                      Base
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      $E 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right"
                                    >
                                      Total
                                    </td>
                                    <td className="totalBlue number textoDetalle">
                                      {`$E ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${asignacion.fichasClub * 4}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 1
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.fichasActividadPrivada * 1
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Amarillo
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 2
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAmarillo}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.cantidadFichasQuedanAmarillo *
                                        2
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3} className="totalLabel ">
                                      Base
                                    </td>
                                    <td className="number lightYellow  textoDetalle">
                                      E$ 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right "
                                    >
                                      Total
                                    </td>
                                    <td className="number totalYellow textoDetalle">
                                      {`E$ ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                      </Colxx>
                    )}
                    {entorno.actividad.tratamiento === 'T3' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered className="tablaCompleta">
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 16
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${asignacion.fichasClub * 16}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.fichasActividadPrivada * 4
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Azul
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 8
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.cantidadFichasQuedanAzul * 8
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Costo de Exclusión
                                    </td>
                                    <td
                                      colSpan="2"
                                      className="number textoDetalle"
                                    >
                                      E$ 32 x{' '}
                                      {asignacion.cantidadJugadoresAmarillo}{' '}
                                      (Jugadores amarillos)
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      -
                                      {`$E ${
                                        asignacion.cantidadJugadoresAmarillo *
                                        32
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Costo de Congestión
                                    </td>
                                    <td
                                      colSpan="2"
                                      className="number textoDetalle"
                                    >
                                      E$ 32 x {asignacion.cantidadJugadoresAzul}{' '}
                                      (Jugadores azules)
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      -
                                      {`$E ${
                                        asignacion.cantidadJugadoresAzul * 32
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="3" className="totalLabel">
                                      Base
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      $E 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right"
                                    >
                                      Total
                                    </td>
                                    <td className="totalBlue number textoDetalle">
                                      {`$E ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${asignacion.fichasClub * 4}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 1
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.fichasActividadPrivada * 1
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Amarillo
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 2
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAmarillo}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.cantidadFichasQuedanAmarillo *
                                        2
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3} className="totalLabel ">
                                      Base
                                    </td>
                                    <td className="number lightYellow  textoDetalle">
                                      E$ 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right "
                                    >
                                      Total
                                    </td>
                                    <td className="number totalYellow textoDetalle">
                                      {`E$ ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                      </Colxx>
                    )}
                    {entorno.actividad.tratamiento === 'T4' && (
                      <Colxx lg="12">
                        {club === 'AZUL' && (
                          <Card>
                            <CardBody>
                              <Table bordered className="tablaCompleta">
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 16
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${asignacion.fichasClub * 16}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.fichasActividadPrivada * 4
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Azul
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 8
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAzul}
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      {`$E ${
                                        asignacion.cantidadFichasQuedanAzul * 8
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Costo de Congestión
                                    </td>
                                    <td
                                      colSpan="2"
                                      className="number textoDetalle"
                                    >
                                      E$ 32 x {asignacion.cantidadJugadoresAzul}{' '}
                                      (Jugadores azules)
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      -
                                      {`$E ${
                                        asignacion.cantidadJugadoresAzul * 32
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan="3" className="totalLabel">
                                      Base
                                    </td>
                                    <td className="number lightBlue textoDetalle">
                                      $E 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right"
                                    >
                                      Total
                                    </td>
                                    <td className="totalBlue number textoDetalle">
                                      {`$E ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
                        )}
                        {club === 'AMARILLO' && (
                          <Card>
                            <CardBody>
                              <Table bordered>
                                <thead>
                                  <tr>
                                    <th
                                      colSpan="4"
                                      className="titulo fondoPlomo"
                                    >
                                      RONDA N°{entorno.actividad.rondaActual}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th className="titulo fondoPlomo">
                                      Ítem de Ganancia
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Pago por ficha-$E
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Fichas
                                    </th>
                                    <th className="titulo fondoPlomo">
                                      Total - $E
                                    </th>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas retiradas de la
                                      cuenta compartida
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 4
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasClub}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${asignacion.fichasClub * 4}`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas que mantiene en
                                      Cuenta Privada
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 1
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.fichasActividadPrivada}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.fichasActividadPrivada * 1
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="textoDetalle">
                                      Ganancias por fichas remanentes en Cuenta
                                      Compartida del Club Amarillo
                                    </td>
                                    <td className="number textoDetalle">
                                      E$ 2
                                    </td>
                                    <td className="number textoDetalle">
                                      {asignacion.cantidadFichasQuedanAmarillo}
                                    </td>
                                    <td className="number lightYellow textoDetalle">
                                      {`E$ ${
                                        asignacion.cantidadFichasQuedanAmarillo *
                                        2
                                      }`}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colSpan={3} className="totalLabel ">
                                      Base
                                    </td>
                                    <td className="number lightYellow  textoDetalle">
                                      E$ 50
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      colSpan="3"
                                      className="totalLabel text-right "
                                    >
                                      Total
                                    </td>
                                    <td className="number totalYellow textoDetalle">
                                      {`E$ ${asignacion.resultadoPesosExperimentales}`}
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </CardBody>
                          </Card>
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
                    color: clubColor.colorLetra,
                  }}
                  disabled={bloqueado}
                >
                  {!bloqueado
                    ? 'Continuar'
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
