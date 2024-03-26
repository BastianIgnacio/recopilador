/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Badge,
  CardFooter,
  Button,
  CardSubtitle,
  CardText,
} from 'reactstrap';
import data from 'data/topRatedItems';

const CardUser = ({ internalId, dataUsuarios, conversor }) => {
  const [conectado, setConectado] = useState(false);
  const [jugador, setJugador] = useState('NO');

  useEffect(() => {
    const aux = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < dataUsuarios.length; i++) {
      aux.push(dataUsuarios[i].client_id);
    }
    if (aux.includes(internalId)) {
      setConectado(true);
      setJugador(conversor[internalId]);
    } else {
      setConectado(false);
      setJugador(conversor[internalId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUsuarios, internalId, conversor]);

  return (
    <Card className="m-2">
      <div className="d-flex justify-content-start m-3">
        <div>
          {conectado && <Button color="success">{internalId}</Button>}
          {!conectado && <Button color="danger">{internalId}</Button>}
        </div>
        <div className="d-flex align-items-center">
          {conectado && (
            <CardText className="text-muted text-medium  ml-3">
              Jugador {jugador}
            </CardText>
          )}
          {!conectado && (
            <CardText className="text-muted text-medium ml-3">
              Jugador {jugador}
            </CardText>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CardUser;
