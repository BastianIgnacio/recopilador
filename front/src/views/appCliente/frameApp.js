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
import Bienvenido from './bienvenido';
import AsignarCreditos from './asignarCreditos';
import Votacion from './votacion';
import ResultadosVotacion from './resultadosVotacion';
import ConexionCerrada from './conexionCerrada';
import FinalizarActividad from './FinalizarActividad';
import FinalizarSesion from './FinalizarSesion';
import Encuesta from './Encuesta';
import FinalizarSesionAgradecimientos from './FinalizarSesionAgradecimientos';

const FrameAppCliente = ({ match }) => {
  const [wsApp, setWsApp] = useState(null);
  const [idWs, setIdWs] = useState(null);
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
  const [mostrarVotacion, setMostrarVotacion] = useState(false);
  const [mostrarEncuesta, setMostrarEncuesta] = useState(false);
  const [mostrarAgradecimientos, setMostrarAgradecimientos] = useState(false);

  const [mostrarFinalizarActividad, setMostrarFinalizarActividad] =
    useState(false);
  const [mostrarFinalizarSesion, setMostrarFinalizarSesion] = useState(false);

  const [capturaEnProceso, setCapturaEnProceso] = useState(false);

  const { id } = useParams();
  const idLink = id.toUpperCase();

  // BIENVENIDO
  // ASIGNAR_CREDITOS
  // RESUMEN_ASIGNACION_CREDITOS
  // MOSTRAR_RESULTADOS_RONDA_Y_VOTACION
  // MOSTRAR_RESULTADOS_VOTACION

  // MOSTRAR_FINALIZAR_ACTIVIDAD
  // MOSTRAR_FINALIZAR_SESION
  // FINALIZAR_SESION_AGRADECIMIENTOS

  const [view, setView] = useState('BIENVENIDO');
  const [club, setClub] = useState('AZUL');
  const [colorFondo, setColorFondo] = useState(colorLightBlue);
  const [bloqueadoView, setBloqueadoView] = useState(false);

  const actualizarClub = (array, integrante) => {
    array.forEach((element) => {
      if (integrante === element.client_id) {
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

  useEffect(() => {
    var arrayDeCadenas = idLink.split('');

    const grupoParse = parseInt(arrayDeCadenas[0], 10);
    const integrante = arrayDeCadenas[1];
    // eslint-disable-next-line vars-on-top
    let webSocketApi = '';

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
      setIdWs(integrante);
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
      const { action, bloqueado, jugadores, notificaciones, traslados } =
        jsonRespuesta;
      const infoJson = jsonRespuesta.info;
      if (action === 'BIENVENIDO') {
        setView('BIENVENIDO');
        setBloqueadoView(bloqueado);
        setCapturaEnProceso(true);
      }
      if (action === 'ASIGNAR_CREDITOS') {
        const rondaActualJson = jsonRespuesta.rondaActual;
        const rondasTotalesJson = jsonRespuesta.rondasTotales;
        const tablasJugadores = jsonRespuesta.arrayTablasJugadores;
        setArrayTablasJugadores(tablasJugadores);

        actualizarClub(jugadores, integrante);
        setView('ASIGNAR_CREDITOS');
        setInfo(infoJson);
        setBloqueadoView(bloqueado);
        setRondaActual(rondaActualJson);
        setRondasTotales(rondasTotalesJson);

        setCapturaEnProceso(true);
        setMostrarFinalizarActividad(false);
        setMostrarFinalizarSesion(false);
      }
      if (action === 'MOSTRAR_RESULTADOS_RONDA_Y_VOTACION') {
        const rondaActualJson = jsonRespuesta.rondaActual;
        const rondasTotalesJson = jsonRespuesta.rondasTotales;
        actualizarClub(jugadores, integrante);
        const tablasJugadores = jsonRespuesta.arrayTablasJugadores;
        const mostrarVotacionJson = jsonRespuesta.mostrarVotacion;

        setView('MOSTRAR_RESULTADOS_RONDA_Y_VOTACION');
        setInfo(infoJson);
        setMostrarVotacion(mostrarVotacionJson);
        setArrayJugadores(jugadores);
        setArrayTablasJugadores(tablasJugadores);
        setBloqueadoView(bloqueado);
        setRondaActual(rondaActualJson);
        setRondasTotales(rondasTotalesJson);
        setCapturaEnProceso(true);
      }
      if (action === 'MOSTRAR_RESULTADOS_VOTACION') {
        setView('MOSTRAR_RESULTADOS_VOTACION');

        actualizarClub(jugadores, integrante);
        setArrayJugadores(jugadores);
        setNotificacionesVotacion(JSON.parse(notificaciones));
        setTrasladosVotacion(JSON.parse(traslados));
      }
      if (action === 'MOSTRAR_FINALIZAR_ACTIVIDAD') {
        const rj = jsonRespuesta.resultadoJugadores;
        const result = rj.filter((tupla) => tupla.client_id === integrante);
        setResultadoJugadores(result);
        setView('MOSTRAR_FINALIZAR_ACTIVIDAD');
        setMostrarFinalizarSesion(false);
        setCapturaEnProceso(false);
        setMostrarFinalizarActividad(true);
      }
      if (action === 'MOSTRAR_FINALIZAR_SESION') {
        const rj = jsonRespuesta.resultadoJugadores;
        const result = rj.filter((tupla) => tupla.client_id === integrante);
        setResultadoJugadores(result);

        setView('MOSTRAR_FINALIZAR_SESION');
        setCapturaEnProceso(false);
        setMostrarFinalizarActividad(false);
        setMostrarFinalizarSesion(true);
      }
      if (action === 'MOSTRAR_ENCUESTA') {
        setView('MOSTRAR_ENCUESTA');
        setCapturaEnProceso(false);
        setBloqueadoView(bloqueado);
        setMostrarFinalizarActividad(false);
        setMostrarFinalizarSesion(false);
        setMostrarEncuesta(true);
        setMostrarAgradecimientos(false);
      }
      if (action === 'FINALIZAR_SESION_AGRADECIMIENTOS') {
        setView('FINALIZAR_SESION_AGRADECIMIENTOS');
        setCapturaEnProceso(false);
        setMostrarFinalizarActividad(false);
        setMostrarFinalizarSesion(false);
        setMostrarEncuesta(false);
        setMostrarAgradecimientos(true);
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
              id={id}
              socketConectado={socketConectado}
              club={club}
              idWs={idWs}
              info={info}
              resultadoJugadores={resultadoJugadores}
            />
          )}
          {mostrarFinalizarSesion && (
            <FinalizarSesion
              id={id}
              socketConectado={socketConectado}
              club={club}
              idWs={idWs}
              info={info}
              resultadoJugadores={resultadoJugadores}
            />
          )}
          {mostrarEncuesta && (
            <Encuesta
              id={id}
              idWs={idWs}
              bloqueado={bloqueadoView}
              ws={wsApp}
            />
          )}
          {mostrarAgradecimientos && (
            <FinalizarSesionAgradecimientos idWs={idWs} grupo={grupo} />
          )}
          {capturaEnProceso && (
            <Card style={{ backgroundColor: colorFondo, minHeight: '780px' }}>
              {club === 'AZUL' && (
                <div
                  style={{ backgroundColor: colorBlue, borderRadius: '10px' }}
                >
                  <div className="d-flex justify-content-between mt-3 ">
                    <Label
                      className="h3 fst-italic ml-4"
                      style={{ color: 'white', fontWeight: 'bold' }}
                    >
                      Grupo {grupo} &#10143; JUGADOR {idWs} &#10143; USTED ES
                      INTEGRANTE DEL CLUB AZUL
                    </Label>

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
                      Grupo {grupo} &#10143; JUGADOR {idWs} &#10143; USTED ES
                      INTEGRANTE DEL CLUB AMARILLO
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
                    id={idWs}
                    ws={wsApp}
                    socketConectado={socketConectado}
                    club={club}
                    bloqueado={bloqueadoView}
                    setBloqueadoView={setBloqueadoView}
                  />
                )}
                {view === 'ASIGNAR_CREDITOS' && (
                  <AsignarCreditos
                    id={idWs}
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
                {view === 'MOSTRAR_RESULTADOS_RONDA_Y_VOTACION' && (
                  <Votacion
                    id={idWs}
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
                    id={idWs}
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
