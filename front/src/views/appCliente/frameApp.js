/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  colorBlue,
  colorYellow,
  colorLightBlue,
  colorLightYellow,
  wsAPI1,
  wsAPI2,
} from 'constants/defaultValues';
import { Card, CardBody, CardHeader, Label } from 'reactstrap';
import { NotificationManager } from 'components/common/react-notifications';
import Bienvenido from './bienvenido';
import AsignarCreditos from './asignarCreditos';
import Votacion from './votacion';
import ResultadosVotacion from './resultadosVotacion';
import ConexionCerrada from './conexionCerrada';
import FinalizarActividad from './FinalizarActividad';
import FinalizarSesion from './FinalizarSesion';
import Encuesta from './Encuesta';
import FinalizarSesionAgradecimientos from './FinalizarSesionAgradecimientos';
import ResumenAsignacionCreditos from './resumenAsignacionCreditos';
import FinalizarActividadPrueba from './FinalizarActividadPrueba';

const FrameAppCliente = ({ match }) => {
  const [wsApp, setWsApp] = useState(null);
  const [grupo, setGrupo] = useState('-');

  const [socketConectado, setSocketConectado] = useState(false);
  const [rondaActual, setRondaActual] = useState(1);
  const [rondasTotales, setRondasTotales] = useState(1);
  const [arrayJugadores, setArrayJugadores] = useState([]);
  const [arrayTablasJugadores, setArrayTablasJugadores] = useState([]);
  const [notificacionesVotacion, setNotificacionesVotacion] = useState([]);
  const [trasladosVotacion, setTrasladosVotacion] = useState([]);
  const [info, setInfo] = useState([]);
  const [resultadoJugadores, setResultadoJugadores] = useState([]);
  const [asignacionesArray, setAsignacionesArray] = useState([]);

  const [mostrarVotacion, setMostrarVotacion] = useState(false);
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [mostrarAgradecimientos, setMostrarAgradecimientos] = useState(false);
  const [mostrarFinalizarActividadPrueba, setMostrarActividadPrueba] =
    useState(false);
  const [mostrarFinalizarActividad, setMostrarFinalizarActividad] =
    useState(false);
  const [mostrarFinalizarSesion, setMostrarFinalizarSesion] = useState(false);

  const [capturaEnProceso, setCapturaEnProceso] = useState(false);

  const { idGrupoParam, idInternParam } = useParams();

  const [grupoParse, setGrupoParse] = useState(parseInt(idGrupoParam, 10));
  const [integrante, setIntegrante] = useState(parseInt(idInternParam, 10));
  const [arrayConvertJugador, setArrayConvertJugador] = useState([]);
  const [jugadorShow, setJugadorShow] = useState('');

  // idInternParam ID ES NUMERO 1-6

  // idGrupoParam es 1 o 2

  // BIENVENIDO
  // ASIGNAR_CREDITOS
  // RESUMEN_ASIGNACION_CREDITOS
  // MOSTRAR_RESULTADOS_RONDA_Y_VOTACION
  // MOSTRAR_RESULTADOS_VOTACION

  // MOSTRAR_FINALIZAR_ACTIVIDAD
  // MOSTRAR_FINALIZAR_SESION
  // FINALIZAR_SESION_AGRADECIMIENTOS

  // ALERT_GRUPO_AZUL_ELIMINADO

  const [view, setView] = useState('BIENVENIDO');
  const [club, setClub] = useState('AZUL');
  const [colorFondo, setColorFondo] = useState(colorLightBlue);
  const [bloqueadoView, setBloqueadoView] = useState(false);

  const actualizarClub = (array, integranteView) => {
    array.forEach((element) => {
      if (String(integranteView) === element.client_id) {
        if (element.club === 'AMARILLO') {
          setClub(element.club);
          setColorFondo(colorLightYellow);
        }
        if (element.club === 'AZUL') {
          setClub(element.club);
          setColorFondo(colorLightBlue);
        }
      }
    });
  };

  const reiniciarVistas = () => {
    setMostrarVotacion(false);
    setMostrarEncuesta(false);
    setMostrarAgradecimientos(false);
    setMostrarActividadPrueba(false);
    setMostrarFinalizarActividad(false);
    setMostrarFinalizarSesion(false);
  };

  useEffect(() => {
    console.log(arrayConvertJugador);
    if (arrayConvertJugador) {
      const jugadorToShow = arrayConvertJugador[integrante];
      setJugadorShow(jugadorToShow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayConvertJugador]);

  useEffect(() => {
    // eslint-disable-next-line vars-on-top
    let webSocketApi = '';
    console.log(grupoParse);
    console.log(integrante);

    if (grupoParse === 1) {
      webSocketApi = wsAPI1;
      setGrupo(1);
    }
    if (grupoParse === 2) {
      webSocketApi = wsAPI2;
      setGrupo(2);
    }
    const websocket = new WebSocket(`${webSocketApi}${integrante}`);
    websocket.onopen = () => {
      // ACA DEBEMOS SOLICITAR UN REDUX
      setSocketConectado(true);
      setWsApp(websocket);
      // ACA DEBEMOS SOLICITAR EL ESTADO ACTUAL DE LA VISTA
      const jsonSend = {
        tipo: 'CLIENTE_SOLICITAR_VISTA',
        data: { cliente: integrante },
      };
      const dataQuery = JSON.stringify(jsonSend);
      websocket.send(dataQuery);
    };
    websocket.onmessage = (e) => {
      const jsonRespuesta = JSON.parse(e.data);
      console.log(jsonRespuesta);
      const { action, bloqueado, jugadores, notificaciones, traslados } =
        jsonRespuesta;
      const infoJson = jsonRespuesta.info;

      if (action === 'ALERT_GRUPO_AZUL_ELIMINADO') {
        NotificationManager.secondary(
          'SE HA DISUELTO EL GRUPO AZUL',
          'ACTIVIDAD FINALIZADA',
          5000,
          null,
          null,
          'filled'
        );
        return;
      }

      if (action === 'BIENVENIDO') {
        reiniciarVistas();

        setView('BIENVENIDO');
        setBloqueadoView(bloqueado);
        setCapturaEnProceso(true);
        setArrayConvertJugador(infoJson.conversorJugadores);
      }
      if (action === 'ASIGNAR_CREDITOS') {
        reiniciarVistas();
        setView('ASIGNAR_CREDITOS');
        const rondaActualJson = jsonRespuesta.rondaActual;
        const rondasTotalesJson = jsonRespuesta.rondasTotales;
        const tablasJugadores = jsonRespuesta.arrayTablasJugadores;

        setArrayTablasJugadores(tablasJugadores);
        actualizarClub(jugadores, integrante);
        setInfo(infoJson);
        setBloqueadoView(bloqueado);
        setRondaActual(rondaActualJson);
        setRondasTotales(rondasTotalesJson);
        setArrayConvertJugador(infoJson.conversorJugadores);

        setCapturaEnProceso(true);
      }
      if (action === 'RESUMEN_ASIGNACION_CREDITOS') {
        reiniciarVistas();
        setView('RESUMEN_ASIGNACION_CREDITOS');

        const rondaActualJson = jsonRespuesta.rondaActual;
        const rondasTotalesJson = jsonRespuesta.rondasTotales;

        setAsignacionesArray(jsonRespuesta.asignaciones);
        setInfo(infoJson);
        setBloqueadoView(bloqueado);
        setRondaActual(rondaActualJson);
        setRondasTotales(rondasTotalesJson);
        setCapturaEnProceso(true);
        setArrayConvertJugador(infoJson.conversorJugadores);
      }
      if (action === 'MOSTRAR_RESULTADOS_RONDA_Y_VOTACION') {
        reiniciarVistas();
        setView('MOSTRAR_RESULTADOS_RONDA_Y_VOTACION');
        const rondaActualJson = jsonRespuesta.rondaActual;
        const rondasTotalesJson = jsonRespuesta.rondasTotales;
        const tablasJugadores = jsonRespuesta.arrayTablasJugadores;
        const mostrarVotacionJson = jsonRespuesta.mostrarVotacion;

        actualizarClub(jugadores, integrante);
        setInfo(infoJson);
        setMostrarVotacion(mostrarVotacionJson);
        setArrayJugadores(jugadores);
        setArrayTablasJugadores(tablasJugadores);
        setBloqueadoView(bloqueado);
        setRondaActual(rondaActualJson);
        setRondasTotales(rondasTotalesJson);
        setCapturaEnProceso(true);
        setArrayConvertJugador(infoJson.conversorJugadores);
      }
      if (action === 'MOSTRAR_RESULTADOS_VOTACION') {
        reiniciarVistas();
        setView('MOSTRAR_RESULTADOS_VOTACION');

        actualizarClub(jugadores, integrante);
        setArrayJugadores(jugadores);
        setNotificacionesVotacion(JSON.parse(notificaciones));
        setTrasladosVotacion(JSON.parse(traslados));
        setArrayConvertJugador(infoJson.conversorJugadores);
      }
      if (action === 'MOSTRAR_FINALIZAR_ACTIVIDAD') {
        reiniciarVistas();
        setCapturaEnProceso(false);
        setView('MOSTRAR_FINALIZAR_ACTIVIDAD');

        const rj = jsonRespuesta.resultadoJugadores;
        console.log(rj);
        const result = rj.filter((tupla) => tupla.client_id === integrante);
        setResultadoJugadores(result);

        setMostrarFinalizarActividad(true);
      }
      if (action === 'MOSTRAR_FINALIZAR_ACTIVIDAD_PRUEBA') {
        reiniciarVistas();
        setCapturaEnProceso(false);
        setView('MOSTRAR_FINALIZAR_ACTIVIDAD_PRUEBA');

        const rj = jsonRespuesta.resultadoJugadores;
        const result = rj.filter((tupla) => tupla.client_id === integrante);
        setResultadoJugadores(result);

        setMostrarActividadPrueba(true);
      }
      if (action === 'MOSTRAR_FINALIZAR_SESION') {
        reiniciarVistas();
        setCapturaEnProceso(false);
        setView('MOSTRAR_FINALIZAR_SESION');

        const rj = jsonRespuesta.resultadoJugadores;
        const result = rj.filter((tupla) => tupla.client_id === integrante);
        setResultadoJugadores(result);

        setMostrarFinalizarSesion(true);
      }
      if (action === 'MOSTRAR_ENCUESTA') {
        reiniciarVistas();
        setCapturaEnProceso(false);
        setView('MOSTRAR_ENCUESTA');

        // parametros necesarios
        setGrupo(jsonRespuesta.info.grupo);

        setBloqueadoView(bloqueado);
        setMostrarEncuesta(true);
      }
      if (action === 'FINALIZAR_SESION_AGRADECIMIENTOS') {
        reiniciarVistas();
        setCapturaEnProceso(false);
        setView('FINALIZAR_SESION_AGRADECIMIENTOS');
        setCapturaEnProceso(false);
        setMostrarAgradecimientos(true);

        const rj = jsonRespuesta.info.resultadoJugadores;
        const result = rj.filter((tupla) => tupla.client_id === integrante);
        setResultadoJugadores(result);
      }
    };
    websocket.onclose = () => {
      console.log('coneccion cerrada');
      setSocketConectado(false);
    };

    return () => {
      websocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {socketConectado ? (
        <>
          {mostrarFinalizarActividad && (
            <FinalizarActividad
              id={String(integrante)}
              socketConectado={socketConectado}
              club={club}
              info={info}
              resultadoJugadores={resultadoJugadores}
            />
          )}
          {mostrarFinalizarSesion && (
            <FinalizarSesion
              id={String(integrante)}
              socketConectado={socketConectado}
              club={club}
              info={info}
              resultadoJugadores={resultadoJugadores}
            />
          )}
          {mostrarEncuesta && (
            <Encuesta
              id={integrante}
              bloqueado={bloqueadoView}
              ws={wsApp}
              grupo={grupo}
            />
          )}
          {mostrarAgradecimientos && (
            <FinalizarSesionAgradecimientos
              grupo={grupo}
              id={integrante}
              resultadoJugadores={resultadoJugadores}
            />
          )}
          {mostrarFinalizarActividadPrueba && (
            <FinalizarActividadPrueba grupo={grupo} />
          )}
          {capturaEnProceso && (
            <Card style={{ backgroundColor: colorFondo, minHeight: '780px' }}>
              {club === 'AZUL' && (
                <div
                  style={{ backgroundColor: colorBlue, borderRadius: '10px' }}
                >
                  <div className="d-flex justify-content-between mt-3 ">
                    {view !== 'BIENVENIDO' ? (
                      <Label
                        className="h3 fst-italic ml-4"
                        style={{ color: 'white', fontWeight: 'bold' }}
                      >
                        Grupo {grupo} &#10143; JUGADOR {jugadorShow} &#10143;
                        USTED ES INTEGRANTE DEL CLUB AZUL
                      </Label>
                    ) : (
                      <Label
                        className="h3 fst-italic ml-4"
                        style={{ color: 'white', fontWeight: 'bold' }}
                      >
                        USTED ES INTEGRANTE DEL CLUB AZUL
                      </Label>
                    )}
                    {view !== 'BIENVENIDO' && (
                      <>
                        {view === 'ASIGNAR_CREDITOS' ? (
                          <Label
                            className="h3 fst-italic"
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              marginRight: '200px',
                            }}
                          >
                            Ronda {rondaActual} de {rondasTotales}
                          </Label>
                        ) : (
                          <Label
                            className="h3 fst-italic"
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              marginRight: '200px',
                            }}
                          >
                            Ronda {rondaActual - 1} de {rondasTotales}
                          </Label>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              {club === 'AMARILLO' && (
                <div
                  style={{ backgroundColor: colorYellow, borderRadius: '10px' }}
                >
                  <div className="d-flex justify-content-between mt-3 ">
                    <Label
                      className="h3 fst-italic ml-4"
                      style={{ color: 'white', fontWeight: 'bold' }}
                    >
                      Grupo {grupo} &#10143; JUGADOR {jugadorShow} &#10143;
                      USTED ES INTEGRANTE DEL CLUB AMARILLO
                    </Label>
                    {view === 'ASIGNAR_CREDITOS' ? (
                      <Label
                        className="h3 fst-italic"
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          marginRight: '200px',
                        }}
                      >
                        Ronda {rondaActual} de {rondasTotales}
                      </Label>
                    ) : (
                      <Label
                        className="h3 fst-italic"
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          marginRight: '200px',
                        }}
                      >
                        Ronda {rondaActual - 1} de {rondasTotales}
                      </Label>
                    )}
                  </div>
                </div>
              )}
              <CardBody>
                {view === 'BIENVENIDO' && (
                  <Bienvenido
                    id={integrante}
                    ws={wsApp}
                    socketConectado={socketConectado}
                    club={club}
                    bloqueado={bloqueadoView}
                    setBloqueadoView={setBloqueadoView}
                  />
                )}
                {view === 'ASIGNAR_CREDITOS' && (
                  <AsignarCreditos
                    id={integrante}
                    socketConectado={socketConectado}
                    ws={wsApp}
                    club={club}
                    rondaActual={rondaActual}
                    rondasTotales={rondasTotales}
                    bloqueado={bloqueadoView}
                    setBloqueadoView={setBloqueadoView}
                    arrayJugadores={arrayJugadores}
                    arrayTablasJugadores={arrayTablasJugadores}
                    info={info}
                  />
                )}
                {view === 'RESUMEN_ASIGNACION_CREDITOS' && (
                  <ResumenAsignacionCreditos
                    id={integrante}
                    socketConectado={socketConectado}
                    ws={wsApp}
                    club={club}
                    rondaActual={rondaActual}
                    rondasTotales={rondasTotales}
                    bloqueado={bloqueadoView}
                    setBloqueadoView={setBloqueadoView}
                    arrayJugadores={arrayJugadores}
                    arrayTablasJugadores={arrayTablasJugadores}
                    info={info}
                    asignaciones={asignacionesArray}
                  />
                )}
                {view === 'MOSTRAR_RESULTADOS_RONDA_Y_VOTACION' && (
                  <Votacion
                    id={integrante}
                    socketConectado={socketConectado}
                    club={club}
                    ws={wsApp}
                    rondaActual={rondaActual}
                    rondasTotales={rondasTotales}
                    setBloqueadoView={setBloqueadoView}
                    bloqueado={bloqueadoView}
                    arrayJugadores={arrayJugadores}
                    arrayTablasJugadores={arrayTablasJugadores}
                    info={info}
                    mostrarVotacion={mostrarVotacion}
                  />
                )}
                {view === 'MOSTRAR_RESULTADOS_VOTACION' && (
                  <ResultadosVotacion
                    id={integrante}
                    socketConectado={socketConectado}
                    club={club}
                    ws={wsApp}
                    notificaciones={notificacionesVotacion}
                    traslados={trasladosVotacion}
                    arrayJugadores={arrayJugadores}
                  />
                )}
              </CardBody>
            </Card>
          )}
        </>
      ) : (
        <ConexionCerrada />
      )}
    </>
  );
};

export default FrameAppCliente;
