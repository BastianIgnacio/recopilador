/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Card,
  Button,
  CardBody,
  CardText,
  CardTitle,
  CardFooter,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { equipos } from 'constants/defaultValues';

const IniciarActividad = ({ match, client_id, ws, entorno }) => {
  const [bloqueado, setBloqueado] = useState(false);
  // SE SETEA EQUIPO 1 YA QUE CORRESPONDE AL AZUL
  const [club, setClub] = useState(equipos[1]);
  const [letra, setLetra] = useState('Z');
  const [numero, setNumero] = useState(0);
  const [rondasTotales, setRondasTotales] = useState(0);

  const comenzarActividad = () => {
    const jsonData = {
      tipo: 'CONFIRMAR_COMIENZO_ACTIVIDAD',
      data: '',
    };
    const jsonToSend = JSON.stringify(jsonData);
    ws.send(jsonToSend);
    setBloqueado(true);
  };

  useEffect(() => {
    const vistasBloqueadas = entorno.vistas;
    const vistaBloqueada = vistasBloqueadas.find(
      (vistaElement) => vistaElement.client_id === client_id
    );
    setBloqueado(vistaBloqueada.bloqueado);

    // SETEAMOS LA ACTIVIDAD EN LA QUE ESTAMOS
    setNumero(entorno.actividad.numero);

    // SETEAMOS LAS RONDAS TOTALES
    setRondasTotales(entorno.actividad.rondas);

    // CHECKEAMOS EL CLUB AL QUE PERTENECE EL JUGADOR
    const jugadorElement = entorno.actividad.jugadores.find(
      (je) => je.client_id === client_id
    );
    setLetra(jugadorElement.letra);
    // AHORA VAMOS A SETEAR EL CLUB
    if (jugadorElement.club === 'AZUL') {
      setClub(equipos[1]);
    }
    if (jugadorElement.club === 'AMARILLO') {
      setClub(equipos[0]);
    }
  }, [client_id, entorno]);

  function capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <Card>
      <CardBody
        style={{
          backgroundColor: club.colorLight,
          borderRadius: '10px',
          minHeight: '700px',
        }}
      >
        <Row className="d-flex justify-content-center">
          <Colxx lg="8">
            <Card className="mb-4" style={{ marginTop: '100px' }}>
              <CardBody>
                <div className="text-center">
                  {entorno.actividad.prueba ? (
                    <>
                      <CardText className="font-weight-bold mb-3 h3">
                        Estamos a punto de empezar con las rondas de práctica
                      </CardText>
                      <CardText className="font-weight-bold mb-3 h3">
                        Su letra de identificación para las siguientes{' '}
                        {rondasTotales} rondas de práctica es &#10143; {letra}
                      </CardText>
                      <CardText className="font-weight-bold mb-4 h3">
                        Además, usted es un integrante del Club{' '}
                        {capitalizarPrimeraLetra(club.club)}
                      </CardText>
                    </>
                  ) : (
                    <>
                      <CardText className="font-weight-bold mb-3 h4">
                        Estamos a punto de empezar la Actividad {numero}!
                      </CardText>
                      <CardText className="text-muted font-weight-bold mb-3 h4">
                        Su letra de identificación para las siguientes{' '}
                        {rondasTotales} rondas es &#10143; {letra}
                      </CardText>
                      <CardText className="text-muted font-weight-bold mb-4 h4">
                        Además, usted es un integrante del Club{' '}
                        {capitalizarPrimeraLetra(club.club)}
                      </CardText>
                    </>
                  )}
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  block
                  size="sm"
                  disabled={bloqueado}
                  onClick={() => comenzarActividad()}
                  style={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    backgroundColor: club.color,
                    borderColor: 'transparent',
                  }}
                >
                  {!bloqueado
                    ? 'Comenzar'
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

export default IniciarActividad;
