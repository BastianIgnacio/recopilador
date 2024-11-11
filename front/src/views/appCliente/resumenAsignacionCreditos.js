/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Row, Card, Button, CardBody } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  colorBlue,
  colorLightBlue,
  colorLightYellow,
  colorPlomo,
  colorYellow,
} from 'constants/defaultValues';
import './transiciones.css';

const ResumenAsignacionCreditos = ({
  match,
  id,
  ws,
  club,
  ronda,
  bloqueado,
  setBloqueadoView,
  rondaActual,
  rondasTotales,
  arrayTablasJugadores,
  info,
  asignaciones,
}) => {
  console.log(info.tratamiento);
  const [fueMonitoreado, setFueMonitoreado] = useState(false);
  const [fueMultado, setFueMultado] = useState(false);
  const [fichasClub, setFichasClub] = useState(0);
  const [fichasActividadPrivada, setFichasActividadPrivada] = useState(0);
  const [multa, setMulta] = useState(0);
  const [fichasRetiroTotalClubAzul, setFichasRetiroTotalClubAzul] = useState(0);
  const [gananciasPesosExperimentales, setGananciasPesosExperimentales] =
    useState(0);
  const [costoDeMonitoreoPorJugador, setCostoDeMonitoreoPorJugador] =
    useState(0);
  const [cantidadJugadoresAmarillos, setCantidadJugadoresAmarillos] =
    useState(0);
  const [costoDeMonitoreo, setCostoDeMonitoreo] = useState(0);

  const enviarVotacionWs = (data) => {
    const jsonSend = {
      tipo: 'CLIENTE_ACEPTAR_RESUMEN_ASIGNACION_FICHAS',
      data,
    };
    const dataQuery = JSON.stringify(jsonSend);
    ws.send(dataQuery);
  };

  const enviarConfirmacion = () => {
    setBloqueadoView(true);
    const data = {
      cliente: id,
    };
    enviarVotacionWs(data);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // console.log(asignaciones);
    const asigItemsClient = asignaciones.filter(
      // eslint-disable-next-line prettier/prettier
      (asig) => asig.client_id === String(id)
    );
    const asigItem = asigItemsClient.find(
      // eslint-disable-next-line prettier/prettier
      (asig) => asig.numeroRonda === rondaActual - 1
    );
    if (asigItem) {
      setFueMonitoreado(asigItem.fueMonitoreado);
      setFueMultado(asigItem.fueMultado);
      setFichasClub(asigItem.fichasClub);
      setFichasActividadPrivada(asigItem.fichasActividadPrivada);
      setMulta(asigItem.multa);
      setFichasRetiroTotalClubAzul(asigItem.fichasRetiroTotalClubAzul);
      setGananciasPesosExperimentales(asigItem.gananciasPesosExperimentales);
      setCostoDeMonitoreoPorJugador(asigItem.costoMonitoreoPorJugador);
      setCantidadJugadoresAmarillos(asigItem.cantidadJugadoresAmarillos);
      setCostoDeMonitoreo(asigItem.costoDeMonitoreo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rondaActual]);

  return (
    <Card>
      <CardBody transition-style="in:square:center">
        {club === 'AMARILLO' && (
          <>
            <Row className="text-center mt-4">
              <Colxx lg="12">
                <div className="h2 mt-4 ml-4 text-left">
                  TUS GANANCIAS EN ESTA RONDA SON:
                </div>
              </Colxx>
              {info.tratamiento === 'T2' && (
                <>
                  <Colxx lg="12" className="ml-4">
                    <div className="h5 m-4 text-left">
                      <li className="mb-3">
                        (+) FICHAS CUENTA PRIVADA &#10143;&#10143;{' '}
                        {fichasActividadPrivada} * (1E$) &#10143;&#10143; E$
                        {fichasActividadPrivada * 1}
                      </li>
                    </div>
                  </Colxx>
                  <Colxx lg="12" className="ml-4">
                    <div className="h3 m-4 text-left">
                      <li className="mb-1 font-weight-bold">
                        Total ganancias &#10143;&#10143; E$
                        {fichasActividadPrivada * 1} (Fichas Cuenta Privada)
                      </li>
                      <li className="mb-2 font-weight-bold">
                        Total ganancias &#10143;&#10143; E$
                        {gananciasPesosExperimentales}
                      </li>
                    </div>
                  </Colxx>
                </>
              )}
              {info.tratamiento === 'T3' && (
                <>
                  <Colxx lg="12" className="ml-4">
                    <div className="h5 m-4 text-left">
                      <li className="mb-3">
                        (+) FICHAS RETIRADAS CUENTA COMPARTIDA CLUB AZUL
                        &#10143;&#10143; {fichasClub} * (4E$) &#10143;&#10143;
                        E$
                        {fichasClub * 4}
                      </li>
                      <li className="mb-3">
                        (+) FICHAS CUENTA PRIVADA &#10143;&#10143;{' '}
                        {fichasActividadPrivada} * (1E$) &#10143;&#10143; E$
                        {fichasActividadPrivada * 1}
                      </li>
                    </div>
                  </Colxx>
                  <Colxx lg="12" className="ml-4">
                    <div className="h3 m-4 text-left">
                      <li className="mb-1 font-weight-bold">
                        Total ganancias &#10143;&#10143; E${fichasClub * 4}{' '}
                        (Fichas Retiradas Cuenta Compartida Club Azul) + E$
                        {fichasActividadPrivada * 1} (Fichas Cuenta Privada)
                      </li>
                      <li className="mb-2 font-weight-bold">
                        Total ganancias &#10143;&#10143; E$
                        {gananciasPesosExperimentales}
                      </li>
                    </div>
                  </Colxx>
                </>
              )}
              {info.tratamiento === 'T4' && (
                <>
                  {fueMonitoreado ? (
                    <Colxx lg="12" className="ml-4">
                      <div className="h4 m-4 text-left font-weight-bold">
                        <li>
                          Fuiste inspeccionado
                          {fueMultado ? (
                            <> y multado. </>
                          ) : (
                            <>
                              , pero no fuiste multado, ya que no retiraste
                              fichas de la Cuenta Compartida Club Azul.
                            </>
                          )}
                        </li>
                      </div>
                    </Colxx>
                  ) : (
                    <Colxx lg="12" className="ml-4">
                      <div className="h4 m-4 text-left font-weight-bold ">
                        <li>NO fuiste inspeccionado.</li>
                      </div>
                    </Colxx>
                  )}
                  <Colxx lg="12" className="ml-4">
                    <div className="h5 m-4 text-left">
                      <li className="mb-3">
                        (+) FICHAS RETIRADAS CUENTA COMPARTIDA CLUB AZUL
                        &#10143;&#10143; {fichasClub} * (4E$) &#10143;&#10143;
                        E$
                        {fichasClub * 4}
                      </li>
                      <li className="mb-3">
                        (+) FICHAS CUENTA PRIVADA &#10143;&#10143;{' '}
                        {fichasActividadPrivada} * (1E$) &#10143;&#10143; E$
                        {fichasActividadPrivada * 1}
                      </li>
                      {fueMultado && (
                        <li className="mb-4">
                          (-) MULTA &#10143;&#10143; {fichasClub} * (8E$)
                          &#10143;&#10143; E$
                          {fichasClub * 8}
                        </li>
                      )}
                    </div>
                  </Colxx>
                  <Colxx lg="12" className="ml-4">
                    <div className="h3 m-4 text-left">
                      {fueMultado ? (
                        <>
                          <li className="mb-1 font-weight-bold">
                            Total ganancias &#10143; E${fichasClub * 4} (Fichas
                            Retiradas Cuenta Compartida Club Azul) + E$
                            {fichasActividadPrivada * 1} (Fichas Cuenta Privada)
                            - E$
                            {fichasClub * 8} (Multa)
                          </li>
                        </>
                      ) : (
                        <li className="mb-1 font-weight-bold">
                          Total ganancias &#10143;&#10143; E${fichasClub * 4}{' '}
                          (Fichas Retiradas Cuenta Compartida Club Azul) + E$
                          {fichasActividadPrivada * 1} (Fichas Cuenta Privada)
                        </li>
                      )}
                      <li className="mb-2 font-weight-bold">
                        Total ganancias &#10143;&#10143; E$
                        {gananciasPesosExperimentales}
                      </li>
                    </div>
                  </Colxx>
                </>
              )}
            </Row>
          </>
        )}
        {club === 'AZUL' && (
          <>
            <Row className="text-center mt-4">
              <Colxx lg="12">
                <div className="h2 mt-4 ml-4 text-left">
                  TUS GANANCIAS EN ESTA RONDA SON:
                </div>
              </Colxx>
              <Colxx lg="12" className="ml-4">
                <div className="h5 m-4 text-left">
                  <li className="mb-3">
                    (+)FICHAS RETIRADAS CUENTA COMPARTIDA CLUB AZUL &#10143;
                    &#10143; {fichasClub} * (E$4) &#10143; &#10143; E$
                    {fichasClub * 4}
                  </li>
                  <li className="mb-3">
                    (+)FICHAS CUENTA PRIVADA &#10143;&#10143;{' '}
                    {fichasActividadPrivada} * (E$1) &#10143;&#10143; E$
                    {fichasActividadPrivada * 1}
                  </li>
                  <li className="mb-4">
                    (+)QUEDAN {-(fichasRetiroTotalClubAzul - 30)} FICHAS EN LA
                    CUENTA COMPARTIDA DEL CLUB AZUL &#10143;&#10143;{' '}
                    {-(fichasRetiroTotalClubAzul - 30)} * (E$2) &#10143;&#10143;
                    E${-(fichasRetiroTotalClubAzul - 30) * 2}
                  </li>
                  {cantidadJugadoresAmarillos > 0 && (
                    <li className="mb-4">
                      (-) COSTO POR EXCLUSIÓN: HAY {cantidadJugadoresAmarillos}{' '}
                      JUGADOR /ES AMARILLOS &#10143;&#10143;{' '}
                      {cantidadJugadoresAmarillos} (JUGADOR/ES) * (E$
                      {costoDeMonitoreoPorJugador}) &#10143;&#10143; E$
                      {costoDeMonitoreo}
                    </li>
                  )}
                </div>
              </Colxx>
              <Colxx lg="12" className="ml-4">
                <div className="h3 m-4 text-left">
                  {cantidadJugadoresAmarillos > 0 ? (
                    <li className="mb-2 font-weight-bold">
                      Total ganancias &#10143;&#10143; E${fichasClub * 4}{' '}
                      (Fichas Retiradas Cuenta Compartida Club Azul) + E$
                      {fichasActividadPrivada * 1} (Fichas Cuenta Privada) + E$
                      {-(fichasRetiroTotalClubAzul - 30) * 2} (Fichas Remanentes
                      Cuenta Compartida Club Azul) - E${costoDeMonitoreo} (Costo
                      por exclusión)
                    </li>
                  ) : (
                    <li className="mb-2 font-weight-bold">
                      Total ganancias &#10143;&#10143; E${fichasClub * 4}{' '}
                      (Fichas Retiradas Cuenta Compartida Club Azul) + E$
                      {fichasActividadPrivada * 1} (Fichas Cuenta Privada) + E$
                      {-(fichasRetiroTotalClubAzul - 30) * 2} (Fichas Remanentes
                      Cuenta Compartida Club Azul)
                    </li>
                  )}

                  <li className="mb-2 font-weight-bold">
                    Total ganancias &#10143;&#10143; E$
                    {gananciasPesosExperimentales}
                  </li>
                </div>
              </Colxx>
            </Row>
          </>
        )}
        <div className="d-flex flex-row-reverse bd-highlight">
          <Button
            className="m-4"
            onClick={enviarConfirmacion}
            disabled={bloqueado}
            style={{
              backgroundColor: colorPlomo,
              fontWeight: 'bold',
              fontSize: '14px',
              color: 'black',
              minWidth: '400px',
            }}
          >
            {!bloqueado ? 'CONTINUAR' : 'Esperando a los otros participantes..'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ResumenAsignacionCreditos;
