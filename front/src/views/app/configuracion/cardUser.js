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

const CardUser = ({ internalId, dataUsuarios, conversor }) => {
  const [conectado, setConectado] = useState(false);
  const [letra, setLetra] = useState('NO');

  useEffect(() => {
    const aux = [];
    if (dataUsuarios.includes(internalId)) {
      setConectado(true);
    } else {
      setConectado(false);
    }
    setLetra(internalId.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUsuarios, internalId, conversor]);

  return (
    <div>
      {conectado && <Button color="success">{internalId}</Button>}
      {!conectado && <Button color="danger">{internalId}</Button>}
    </div>
  );
};

export default CardUser;
