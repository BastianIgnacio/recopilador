/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  colorLightBlue,
  colorLightYellow,
  wsAPI1,
  wsAPI2,
} from 'constants/defaultValues';
import Bienvenido from './bienvenido';
import IniciarActividad from './inciarActividad';
import AsignarCreditos from './asignarCreditos';
import VotacionExcluir from './votacionExcluir';
import VotacionIncluir from './votacionIncluir';
import ResumenActividad from './resumenActividad';
import ResumenSesion from './resumenSesion';
import Encuesta from './Encuesta';
import Agradecimientos from './agradecimientos';
import DetalleAsignacionCreditos from './detalleAsignacionCreditos';
import ResultadoExclusion from './resultadoExclusion';
import ResultadoInclusion from './resultadoInclusion';
import './transiciones.css';

const FrameAppCliente = ({ match }) => {
  // PARA DIFERENCIAR EL GRUPO EN QUE ESTAN LOS JUGADORES

  const [entorno, setEntorno] = useState([]);
  const [socketConectado, setSocketConectado] = useState(false);
  const [ws, setWs] = useState([]);

  const { idGrupoParam, idInternParam } = useParams();
  const [grupo, setGrupo] = useState(parseInt(idGrupoParam, 10));
  const [integrante, setIntegrante] = useState(parseInt(idInternParam, 10));

  const [arrayConvertJugador, setArrayConvertJugador] = useState([]);
  const [jugadorShow, setJugadorShow] = useState('');

  const [colorFondo, setColorFondo] = useState(colorLightBlue);

  const actualizarClub = (array, integranteView) => {
    array.forEach((element) => {
      if (String(integranteView) === element.client_id) {
        if (element.club === 'AMARILLO') {
          setColorFondo(colorLightYellow);
        }
        if (element.club === 'AZUL') {
          setColorFondo(colorLightBlue);
        }
      }
    });
  };

  useEffect(() => {
    if (arrayConvertJugador) {
      const jugadorToShow = arrayConvertJugador[integrante];
      setJugadorShow(jugadorToShow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayConvertJugador]);

  useEffect(() => {
    // eslint-disable-next-line vars-on-top
    let webSocketApi = '';

    if (grupo === 1) {
      webSocketApi = wsAPI1;
    }
    if (grupo === 2) {
      webSocketApi = wsAPI2;
    }
    const websocket = new WebSocket(`${webSocketApi}${integrante}`);
    setWs(websocket);
    websocket.onopen = () => {
      setSocketConectado(true);
      // ACA DEBEMOS SOLICITAR EL ESTADO ACTUAL DE LA VISTA
      const jsonSend = {
        tipo: 'CLIENTE_SOLICITAR_ENTORNO',
        data: { cliente: integrante },
      };
      const dataQuery = JSON.stringify(jsonSend);
      websocket.send(dataQuery);
    };
    websocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      const { tipo } = data;

      if (tipo === 'DATOS_ENTORNO') {
        console.log(entorno);
        setEntorno(data.entorno);
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
        <div className="circle-in-hesitate" style={{ minHeight: '800px' }}>
          {entorno.estado === 'MOSTRAR_BIENVENIDO' && (
            <Bienvenido ws={ws} client_id={integrante} entorno={entorno} />
          )}
          {entorno.estado === 'MOSTRAR_INICIAR_ACTIVIDAD' && (
            <IniciarActividad
              entorno={entorno}
              ws={ws}
              client_id={integrante}
            />
          )}
          {entorno.estado === 'MOSTRAR_ASIGNAR_CREDITOS' && (
            <>
              <AsignarCreditos
                entorno={entorno}
                ws={ws}
                client_id={integrante}
              />
            </>
          )}
          {entorno.estado === 'MOSTRAR_DETALLE_ASIGNACION_CREDITOS' && (
            <DetalleAsignacionCreditos
              entorno={entorno}
              ws={ws}
              client_id={integrante}
            />
          )}

          {entorno.estado === 'MOSTRAR_VOTAR_EXCLUIR' && (
            <VotacionExcluir entorno={entorno} ws={ws} client_id={integrante} />
          )}
          {entorno.estado === 'MOSTRAR_RESULTADO_EXCLUSION' && (
            <ResultadoExclusion
              entorno={entorno}
              ws={ws}
              client_id={integrante}
            />
          )}
          {entorno.estado === 'MOSTRAR_VOTAR_INCLUIR' && (
            <VotacionIncluir entorno={entorno} ws={ws} client_id={integrante} />
          )}
          {entorno.estado === 'MOSTRAR_RESULTADO_INCLUSION' && (
            <ResultadoInclusion
              entorno={entorno}
              ws={ws}
              client_id={integrante}
            />
          )}
          {entorno.estado === 'MOSTRAR_RESUMEN_ACTIVIDAD' && (
            <ResumenActividad
              entorno={entorno}
              ws={ws}
              client_id={integrante}
            />
          )}
          {entorno.estado === 'MOSTRAR_RESUMEN_SESION' && <ResumenSesion />}
          {entorno.estado === 'MOSTRAR_ENCUESTA' && (
            <Encuesta
              entorno={entorno}
              ws={ws}
              client_id={integrante}
              grupo={grupo}
            />
          )}
          {entorno.estado === 'MOSTRAR_AGRADECIMIENTOS' && <Agradecimientos />}
        </div>
      ) : (
        <> DESCONECTADO </>
      )}
    </>
  );
};

export default FrameAppCliente;
